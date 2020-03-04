public with sharing class CustomLookupController {
    private final static Integer MAX_RESULTS = 5;

    @AuraEnabled(Cacheable=true)
    public static List<LookupSearchResult> search(
        String searchTerm,
        List<String> selectedIds,
        String tableName
    ) {
        searchTerm += '*';

        System.debug(tableName);
        String searchquery = 'FIND \'' + searchTerm +
            '\' IN ALL FIELDS' +
            ' RETURNING ' +
                tableName + '(Id, Name)' +
            ' LIMIT :MAX_RESULTS';
        List<SObject>searchResults = search.query(searchquery)[0];

        String icon;
        switch on tableName {
            when 'Cat__c' {
                icon = 'utility:animal_and_nature';
            }
            when 'Hotel__c' {
                icon = 'standard:household';
            }
            when else {
                icon = 'standard:lightning_component';
            }
        }

        List<LookupSearchResult> results = new List<LookupSearchResult>();
        for (SObject obj : searchResults) {
            results.add(
                new LookupSearchResult(
                    obj.Id,
                    tableName,
                    icon,
                    (String)obj.get('Name'),
                    tableName
                )
            );
        }

        return results;
    }
}

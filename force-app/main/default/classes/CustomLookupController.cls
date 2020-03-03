public with sharing class CustomLookupController {
    private final static Integer MAX_RESULTS = 5;

    @AuraEnabled(Cacheable=true)
    public static List<LookupSearchResult> search(
        String searchTerm,
        List<String> selectedIds
    ) {
        // Prepare query paramters
        searchTerm += '*';

        // Execute search query
        List<List<SObject>> searchResults = [
            FIND :searchTerm
            IN ALL FIELDS
            RETURNING
                Cat__c(Id, Name WHERE id NOT IN :selectedIds),
                Hotel__c(Id, Name WHERE id NOT IN :selectedIds)
            LIMIT :MAX_RESULTS
        ];

        // Prepare results
        List<LookupSearchResult> results = new List<LookupSearchResult>();

        // Extract Cats & convert them into LookupSearchResult
        String catIcon = 'utility:animal_and_nature';
        Cat__c[] cats = ((List<Cat__c>) searchResults[0]);
        for (Cat__c cat : cats) {
            results.add(
                new LookupSearchResult(
                    cat.Id,
                    'Cat__c',
                    catIcon,
                    cat.Name,
                    'cat • '
                )
            );
        }

        // Extract Hotels & convert them into LookupSearchResult
        String hotelIcon = 'standard:household';
        Hotel__c[] hotels = ((List<Hotel__c>) searchResults[1]);
        for (Hotel__c hotel : hotels) {
            results.add(
                new LookupSearchResult(
                    hotel.Id,
                    'Hotel__c',
                    hotelIcon,
                    hotel.Name,
                    'Hotel__c • '
                )
            );
        }

        return results;
    }
}

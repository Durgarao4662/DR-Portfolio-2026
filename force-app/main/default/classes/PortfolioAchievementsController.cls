// PortfolioAchievementsController.cls
public with sharing class PortfolioAchievementsController {

    /**
     * Returns ALL achievement records sorted by Sort_Order__c.
     * Category values drive which section they appear in:
     *   Award       → Achievements spotlight section
     *   Certificate → Certificates section
     *   Goodie      → Community Goodies section
     */
    @AuraEnabled(cacheable=true)
    public static List<Portfolio_Achievement__mdt> getAchievements() {
        return [
            SELECT  MasterLabel,
                    Title__c,
                    Issuer__c,
                    Year__c,
                    Description__c,
                    Category__c,
                    Icon_Emoji__c,
                    Badge_Color__c,
                    Is_Featured__c,
                    Detail_URL__c,
                    Sort_Order__c
            FROM    Portfolio_Achievement__mdt
            WHERE   Is_Active__c = true
            ORDER BY Sort_Order__c ASC NULLS LAST,
                     Year__c      DESC
        ];
    }
}

/*
════════════════════════════════════════════════════════
  CUSTOM METADATA TYPE: Portfolio_Achievement__mdt
════════════════════════════════════════════════════════
  Label       : Portfolio Achievement
  Plural Label: Portfolio Achievements
  API Name    : Portfolio_Achievement__mdt

  FIELDS TO CREATE:
  ──────────────────────────────────────────────────────
  Field Label    API Name         Type              Notes
  ──────────────────────────────────────────────────────
  Title          Title__c         Text(255)         Required
  Issuer         Issuer__c        Text(255)         e.g. Salesforce / Verticurl
  Year           Year__c          Text(10)          e.g. 2021
  Description    Description__c   Long Text(32768)  Detail shown on hover/card
  Category       Category__c      Picklist          Award | Certificate | Goodie
  Icon Emoji     Icon_Emoji__c    Text(10)          e.g. 🏆 🎖️ 🎓 🎁
  Badge Color    Badge_Color__c   Text(10)          Hex: e.g. #FFD700
  Is Featured    Is_Featured__c   Checkbox          Featured = large spotlight card
  Is Active      Is_Active__c     Checkbox          Default true; set false to hide
  Detail URL     Detail_URL__c    URL               Optional verify/detail link
  Sort Order     Sort_Order__c    Number(3,0)       Controls display order

  ──────────────────────────────────────────────────────
  SAMPLE RECORDS (add via Manage Records):
  ──────────────────────────────────────────────────────

  1. Title:       Winner of Salesforce Developer Program
     Issuer:      Salesforce
     Year:        2021
     Description: Recognised as a top-performing developer in the annual
                  Salesforce Developer Program for outstanding contributions
                  to the Salesforce ecosystem through innovative solutions
                  and best-practice implementations.
     Category:    Award
     Icon Emoji:  🏆
     Badge Color: #FFD700
     Is Featured: true
     Is Active:   true
     Sort Order:  1

  2. Title:       Q2 SPOT Award
     Issuer:      Verticurl
     Year:        2022
     Description: Honored with the Q2 SPOT (Special Performance On Target)
                  Award at Verticurl in recognition of exceptional client
                  delivery, cross-team collaboration, and exceeding
                  performance benchmarks during Q2 2022.
     Category:    Award
     Icon Emoji:  ⭐
     Badge Color: #00A1E0
     Is Featured: true
     Is Active:   true
     Sort Order:  2

  3. Title:       Transformer of the Month Award
     Issuer:      Verticurl
     Year:        2024
     Description: Awarded Transformer of the Month at Verticurl for driving
                  a high-impact digital transformation initiative, demonstrating
                  leadership and delivering measurable results for a global client.
     Category:    Award
     Icon Emoji:  🚀
     Badge Color: #9B59B6
     Is Featured: true
     Is Active:   true
     Sort Order:  3

  ──────────────────────────────────────────────────────
  SAMPLE CERTIFICATE RECORDS:
  ──────────────────────────────────────────────────────
  Title: Salesforce Certified Administrator
  Issuer: Salesforce | Year: 2022 | Category: Certificate
  Icon Emoji: 🛡️ | Badge Color: #00A1E0 | Sort: 10

  Title: Salesforce Platform Developer I
  Issuer: Salesforce | Year: 2022 | Category: Certificate
  Icon Emoji: ⚡ | Badge Color: #0070D2 | Sort: 11

  ──────────────────────────────────────────────────────
  SAMPLE GOODIE RECORDS:
  ──────────────────────────────────────────────────────
  Title: Salesforce Trailblazer Hoodie
  Issuer: Salesforce | Year: 2021 | Category: Goodie
  Description: Official Salesforce Trailblazer hoodie awarded to
               top contributors at Dreamforce 2021.
  Icon Emoji: 👕 | Badge Color: #27AE60 | Sort: 20

  ──────────────────────────────────────────────────────
  GUEST USER PERMISSIONS:
  ──────────────────────────────────────────────────────
  Setup → Profiles → [Site Guest Profile]
    Apex Class Access → PortfolioAchievementsController ✓
  (Custom Metadata is readable by all by default — no OWD needed)
════════════════════════════════════════════════════════
*/
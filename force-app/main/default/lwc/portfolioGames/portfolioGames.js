// portfolioGames.js
import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class PortfolioGames extends NavigationMixin(LightningElement) {

    games = [
        {
            id          : 1,
            title       : 'Salesforce Quiz',
            emoji       : '🧠',
            description : 'Test your Salesforce knowledge across Admin, Dev & Architect topics',
            difficulty  : 'Easy',
            tags        : ['Admin', 'Apex', 'Trivia'],
            cardStyle   : 'background: linear-gradient(145deg, #00BCD4, #006064)',
            badgeStyle  : 'background: #00E676; color: #003300',
            pageApiName : 'salesforce_quiz__c',
            comingSoon  : false
        },
        {
            id          : 2,
            title       : 'Memory Card Match',
            emoji       : '🃏',
            description : 'Flip and match Salesforce Cloud icons before the timer runs out',
            difficulty  : 'Medium',
            tags        : ['CSS', 'Animation', 'Memory'],
            cardStyle   : 'background: linear-gradient(145deg, #9C27B0, #4A148C)',
            badgeStyle  : 'background: #FFC107; color: #3E2723',
            pageApiName : 'memory_match__c',
            comingSoon  : false
        },
        {
            id          : 3,
            title       : 'SOQL Snake',
            emoji       : '🐍',
            description : 'Classic snake game — collect SOQL keywords to build queries',
            difficulty  : 'Hard',
            tags        : ['Canvas', 'DOM', 'Keyboard'],
            cardStyle   : 'background: linear-gradient(145deg, #F44336, #B71C1C)',
            badgeStyle  : 'background: #FF5252; color: #ffffff',
            pageApiName : 'soql_snake__c',
            comingSoon  : false
        },
        {
            id          : 4,
            title       : 'Trailhead Trivia',
            emoji       : '🏆',
            description : 'Earn virtual badges by answering Trailhead-style questions',
            difficulty  : 'Easy',
            tags        : ['Trivia', 'Badges', 'LWC'],
            cardStyle   : 'background: linear-gradient(145deg, #0070D2, #032D60)',
            badgeStyle  : 'background: #00E676; color: #003300',
            pageApiName : 'trailhead_trivia__c',
            comingSoon  : false
        }
    ];

    navigateToGame(event) {
        const pageApiName = event.currentTarget.dataset.page;
        this[NavigationMixin.Navigate]({
            type       : 'comm__namedPage',
            attributes : { name: pageApiName }
        });
    }
}
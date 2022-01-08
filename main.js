class PersonService {
    getUserById(id){
        return fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    }
}

class Person {
    firstName;
    lastname;
    middleName;
    fullNamePieces;

    constructor(data, personService) {
        this.firstName = data.firstname || '';
        this.lastName = data.lastName || '';
        this.middleName = data.middleName || '';
        this.fullNamePieces = [data.firstName, data.middleName, data.lastName];
        this.id = data.id;
        this.personService = personService;
    }
    
    async getMyFullUserData() {
        return this.personService.getUserById(this.id);
    }

    get fullName(){
        if(this.middleName.length > 0){
            return `${this.firstName} ${this.middleName[0]}. ${this.lastName}`
        }
        return `${this.firstName} ${this.lastName}`;
    }

    sayMyName(){
        window.alert(this.fullName);
    }

    getCodeName(){
        const isATestingGod = confirm('Are you a testing god?');

        if (isATestingGod){
            return 'TESTING GOD';
        }else{
            return `Scrub skipping tests in his best friend's ride`;
        }
    }
}

//Test Suite
describe(`${Person.name} Class`, () => {

    //declare variable for Person instance
    let model;
    let mockPersonService;

    //instantiate a new Person before each test is run
    beforeEach(()=>{
        const data = { firstName: 'Matthew', middleName: 'Ryan', lastName: 'Keplinger', id: 1};
        mockPersonService = {
            lastId: null,
            user: {},
            getUserById(id){
                this.lastId = id;
                return this.user;
            }
        }
        model = new Person(data, mockPersonService);
    });
    //Describe for default name values
    describe('Default values for Names', ()=>{
        it('First name defaults to empty string', () => {
            expect(model.firstName).toBe('');
        });
        it('Last name defaults to empty string', () => {
            expect(model.lastName).toBe('');
        });
        it('Middle name defaults to empty string', () => {
            expect(model.middleName).toBe('');
        });
    });
    // Full name
    describe('Full name', () => {
        beforeEach(() => {
            model = new Person({
                firstName: 'Matthew',
                lastName: 'Keplinger'
            })
        })

        it('middle initial when middle name is defined with first and last', () => {
            //arrange
            model.middleName = 'Ryan';

            //act
            const result = model.fullName

            //audit to shorten things up
            const { firstName: fn, lastName: ln, middleName: mn } = model;

            //assert
            expect(result).toBe(`${fn} ${mn[0]}. ${ln}`)
        });

        it('when NO middle name returns just first and last',() => {
            //arrange
            model.middleName = '';

            //act
            const result = model.fullName;

            //audit
            const { firstName: fn, lastName: ln } = model;

            //assert
            expect(result).toBe(`${fn} ${ln}`);
        });
    });
    //Say my name
    describe('Say my name', () => {
        it('alerts the full name of user', () => {
            //arrange
            model.firstName = 'Matthew';
            model.lastName = 'Keplinger';
            spyOn(window,'alert');

            //act
            model.sayMyName();

            //assert
            expect(window.alert).toHaveBeenCalledWith(model.fullName)
        })
    });
    // Get Code name
    describe('Get code name', () => {
        it('When confirmed is a coding/testing god', () => {
            //arrange
            spyOn(window, 'confirm').and.returnValue(true);

            //act
            const result = model.getCodeName();

            //assert
            expect(result).toBe('TESTING GOD');
        })
        it('When not confirmed is just another scrub', () => {
            //arrange
            spyOn(window, 'confirm').and.returnValue(false);

            //act
            const result = model.getCodeName();

            //assert
            expect(result).toBe(`Scrub skipping tests in his best friend's ride`);
        })
    });
    //Mock API data 
    describe('getMyFullUserData', () => {
        it('Gets user data by id', async () => {
            //arrange
            mockPersonService.lastId = null;
            mockPersonService.user = {
                firstName: 'Matthew', 
                middleName: 'Ryan', 
                lastName: 'Keplinger', 
                id: 1
            };

            //act
            const result = await model.getMyFullUserData();

            //assert
            expect(mockPersonService.lastId).toBe(1)
        })
    });
    //additional Matchers
    describe('additional matchers examples', () => {
        //toBeDefined() toEqual()
        it('exists', () => {
            //assert
            expect(Person).toBeDefined();
        });
        it('gets full name pieces', () =>{
            const firstName = 'Matthew';
            const middleName = 'Ryan';
            const lastName = 'Keplinger';

            //act
            model = new Person({firstName, middleName, lastName})

            //assert
            expect(model.fullNamePieces).toEqual([firstName, middleName, lastName]);
        });
    });
    //Match with RegExp
    describe('additional match test area', () => {
        it('fullName has my first name', () =>{
            //arrange
            const firstName = 'Matt';
            const lastName = 'Keplinger';

            //act
            model =  new Person({firstName, lastName});
            //assert
            expect(model.fullName).toMatch(/Matt/);
        })
    });
});
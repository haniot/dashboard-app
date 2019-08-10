export class QuestionnaireGenericType {
    id: string;
    display_name: string;

    constructor() {
        this.id = '';
        this.display_name = '';
    }
}


export class QuestionnaireType {
    nutritional: Array<QuestionnaireGenericType>
    odontological: Array<QuestionnaireGenericType>

    constructor() {
        this.nutritional = new Array<QuestionnaireGenericType>();
        this.odontological = new Array<QuestionnaireGenericType>();
    }

}

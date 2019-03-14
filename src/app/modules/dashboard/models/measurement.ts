export interface Measurement{
    deviceId: string,
    registrationDate: number,
    typeId: number,
    unit : string,
    userId: string,
    value: number,
    measurements : Array<Measurement>,
    context : Array<Context>
}


export interface Context{
    valueId : number,
    typeId: number
}
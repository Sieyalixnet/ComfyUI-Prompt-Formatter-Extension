export type messageType = "Command"
export type PopoutMessage = {
    type:messageType
    content:string
}
export type ResponseMessage = {
    response:any
}
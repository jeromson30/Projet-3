export function verifySession(){
    let validation = false;

    if(window.sessionStorage.getItem("userId") !== null & window.sessionStorage.getItem("token") !== null){
        validation = true;
        console.log("Token détecté");
    }
    return validation;
};
export function verifySession(){
    let validation = false;

    if(window.sessionStorage.getItem("userId") !== null & window.sessionStorage.getItem("token") !== null){
        console.log("Token détecté");
        validation = true;
    }
    return validation;
};
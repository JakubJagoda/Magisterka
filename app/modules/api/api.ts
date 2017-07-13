const API_URL = 'http://localhost:8000/api.php?o=';
const VERSION = '1.0.4';

interface IRegisterUserParams {
    login: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface ILoginUserParams {
    login: string;
    password: string;
}

interface ILoginUserResponse {
    id: string;
    login: string;
    avatar: string;
}

type OperationTypes = 'register' | 'getdata' | 'sendanswers' | 'sendstats' |'getstats' | 'login' | 'register_user';

export async function registerUser({login, email, password, confirmPassword: confirm_password}: IRegisterUserParams) {
    return postToApi('register_user', {
        login,
        email,
        password,
        confirm_password
    });
}

export async function loginUser({login, password}: ILoginUserParams): Promise<ILoginUserResponse> {
    return postToApi('login', {login, password});
}

export async function registerDevice(name: string) {
    return postToApi('register', {
        name,
        version: VERSION
    });
}

function postToApi(operation: OperationTypes, data: {[key: string]: any}) {
    const formData = new FormData();

    Object.keys(data).forEach(key => formData.append(key, data[key]));

    return fetch(`${API_URL}${operation}`, {
        method: 'POST',
        body: formData
    }).then(readResponse);
}

async function readResponse(response:Response) {
    const responseText = await response.text();

    if (response.status !== 200 || responseText.startsWith('Error: ')) {
        //yeah, don't ask me, someone decided it's a good idea to return 200 as errors
        return Promise.reject(new Error(responseText));
    }

    let returnValue;
    try {
        returnValue = JSON.parse(responseText);
    } catch (e) {
        returnValue = responseText;
    }

    return returnValue;
}
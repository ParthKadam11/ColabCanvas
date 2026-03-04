import AuthPage from "@/app/AuthPage";

export default function SignIn(){
    return (
        <main className="bg-black text-white">
            <AuthPage isSignin={true}/>
        </main>
    );
}
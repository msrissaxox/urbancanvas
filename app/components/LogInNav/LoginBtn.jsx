

export default function LoginButton( { onLogin }) {
    return (

<button className="text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-gray-500 hover:bg-white transition duration-300 w-32 text-center"
         onClick={onLogin}
         >
  Log in with Google
</button>
    )
};

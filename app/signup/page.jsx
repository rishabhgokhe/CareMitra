import SignUpForm from "../../components/authForm/SignUpForm";

export default function Page() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      
      {/* <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]" /> */}
      <div className="absolute inset-0 bg-[url('/svgs/noise.svg')] opacity-10" />

      <div className="relative z-10 w-full max-w-sm md:max-w-3xl px-4">
        <SignUpForm />
      </div>
    </div>
  );
}

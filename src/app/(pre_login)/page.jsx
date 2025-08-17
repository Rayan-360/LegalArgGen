import Link from "next/link";

export default function Home() {
  return (
    <div className=" h-screen bg-[url('/light.jpg')] dark:bg-[url('/dark.png')] bg-no-repeat bg-center bg-cover flex flex-col gap-4 justify-center items-center p-3 ">
      <h3 className="text-sm md:text-md flex-wrap text-center text-gray-600 max-w-2xl uppercase">Your trusted partner in legal analysis</h3>
      <h1 className="text-5xl md:text-6xl font-semibold text-center dark:text-white">AI-powered legal reasoning <br/> you can rely on</h1>
      <h3 className="text-md md:text-lg flex-wrap text-center text-gray-600 max-w-2xl">Harness the power of AI to craft precise, well-structured legal arguments in seconds.
          From case facts to IRAC analysis — faster, clearer, and more reliable.
      </h3>
      <Link href="/" className="border-2 border-black px-6 py-3 rounded-full dark:bg-[#161618] text-black font-semibold hover:bg-black hover:text-white transition-all dark:text-white dark:border-1 dark:border-white">Get Started</Link>
    </div>
  );
}


import Image from "next/image";

export default function About(){
    return(
        <div className="w-full dark:text-white">
            {/* about us */}
            <section className="min-h-screen bg-[url('/light.jpg')] dark:bg-[url('/dark.png')] bg-no-repeat bg-center bg-cover flex justify-center items-center">
                <div className="flex flex-col lg:flex-row p-5 gap-16 mt-10">
                    <div className="flex flex-col gap-3 max-w-xl lg:w-1/2 justify-start lg:text-left text-center">
                        <h3 className="text-gray-500">ABOUT US</h3>
                        <h1 className="font-bold text-4xl">Transforming Legal Reasoning with AI</h1>
                        <p className="leading-6 text-md">
                        At LegalArgGen, we merge law and technology to generate well-structured
                        legal arguments in the IRAC format. Our platform leverages advanced AI
                        to bring clarity and consistency to complex legal reasoning.
                        </p>

                        <p className="leading-6 text-md">
                        Built to minimize AI hallucinations, LegalArgGen helps lawyers, students,
                        and researchers streamline case analysis, save valuable time, and
                        strengthen legal strategies with reliable, data-driven insights.
                        </p>

                    </div>
                    <div className="flex flex-col max-w-xl lg:w-1/2 items-center justify-center">
                        <Image src="/about_img.jpg" className="rounded-md" width={500} height={500} alt="about image"/>
                    </div>
                </div>
            </section>
            {/* Our mission */}
            <section className="min-h-screen bg-gray-200 dark:bg-[#1a1a1a] flex justify-center items-center">
                <div className="flex flex-col lg:flex-row p-5 gap-16">
                    <div className="flex flex-col max-w-xl lg:w-1/2 items-center justify-center">
                        <Image src="/mission.jpg" className="rounded-md" width={500} height={500} alt="about image"/>
                    </div>
                    <div className="max-w-xl lg:w-1/2 flex flex-col gap-4 text-center lg:text-left">
                        <h3 className="text-gray-500">OUR MISSION</h3>
                        <h1 className="font-bold text-3xl md:text-4xl">
                            Building Trustworthy AI for Law
                        </h1>
                        <p className="leading-6 text-md">
                            Our mission is to empower lawyers, students, and researchers with
                            AI-driven tools that reduce errors and hallucinations while
                            enhancing clarity, efficiency, and trust in legal reasoning.
                        </p>
                        <p className="leading-6 text-md">
                        We envision a future where technology acts as a trusted partner in the
                        legal profession—streamlining repetitive work, strengthening critical
                        thinking, and ensuring fairer access to justice. At LegalArgGen, every
                        innovation is built around responsibility, transparency, and the belief
                        that AI should assist rather than replace human judgment.
                        </p>
                    </div>
                </div>
            </section>

        </div>
    )
}
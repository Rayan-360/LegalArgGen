
export default function ContactUs() {
  return (
    <div className="min-h-screen bg-[url('/light.jpg')] dark:bg-[url('/dark.png')] bg-no-repeat bg-center bg-cover flex justify-center items-center">
      <div className="flex flex-col md:flex-row gap-8 items-center justify-center p-6 md:p-10 w-full md:w-[90%] mt-20 md:mt-0">
        
        {/* Left Section */}
        <div className="w-full md:w-1/2 flex flex-col gap-6 dark:text-white text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-semibold">
            Get in touch with us
          </h1>
          <p className="line-clamp-3 text-sm sm:text-base md:text-lg">
            We're here to help! Whether you have a question about our services, need assistance with your account,
            or want to provide feedback, our team is ready to assist you.
          </p>
          <div>
            <p className="text-base sm:text-lg">Email:</p>
            <p className="font-semibold text-lg sm:text-xl md:text-2xl">LegalArgGen@gmail.com</p>
          </div>
        </div>

        {/* Right Section (Form) */}
        <div className="bg-white w-full md:w-1/2 px-4 sm:px-10 py-6 rounded-lg shadow-md dark:bg-[#242628]">
          <form action="" className="flex flex-col gap-6">
            
            {/* Name Fields */}
          <div className="flex flex-col lg:flex-row w-full items-center justify-between gap-6 text-sm">
            <div className="flex flex-col w-full lg:w-1/2 gap-2">
              <label htmlFor="fname" className="font-semibold text-gray-500 dark:text-gray-400">
                First Name
              </label>
              <input 
                type="text" 
                id="fname" 
                className="font-semibold p-3 rounded-full border border-gray-400 bg-[#FAFAFA] dark:bg-[#161618] dark:text-white" 
                placeholder="Enter your first name" 
              />
            </div>
            <div className="flex flex-col w-full lg:w-1/2 gap-2">
              <label htmlFor="lname" className="font-semibold text-gray-500 dark:text-gray-400">
                Last Name
              </label>
              <input 
                type="text" 
                id="lname" 
                className="font-semibold p-3 rounded-full border border-gray-400 bg-[#FAFAFA] dark:bg-[#161618] dark:text-white" 
                placeholder="Enter your last name" 
              />
            </div>
          </div>



            {/* Email */}
            <div className="flex flex-col gap-2 text-sm">
              <label htmlFor="email" className="font-semibold text-gray-500 dark:text-gray-400">Email</label>
              <input 
                type="email" 
                id="email" 
                className="font-semibold rounded-full p-3 border border-gray-400 bg-[#FAFAFA] dark:bg-[#161618] dark:text-white" 
                placeholder="Enter your email address" 
              />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2 text-sm">
              <label htmlFor="content" className="font-semibold text-gray-500 dark:text-gray-400">How can we help you?</label>
              <textarea 
                id="content" 
                className="font-semibold rounded-3xl p-3 border h-[200px] border-gray-400 bg-[#FAFAFA] dark:bg-[#161618] dark:text-white" 
                placeholder="Write your message here..." 
              />
            </div>

            {/* Button */}
            <div className="flex w-full justify-center md:justify-end">
              <button className="dark:bg-[#161618] bg-black hover:bg-[#161618] text-white px-6 py-3 rounded-full dark:hover:bg-black cursor-pointer transition border dark:border-white w-[170px]">
                Send Message
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}

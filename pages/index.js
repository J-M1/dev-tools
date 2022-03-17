import Head from 'next/head'
import { useState } from 'react';
import javascript from '../convert/javascript'
import go from '../convert/go'

export default function Home() {
	const [input, inputState] = useState("");
	const [output, outputState] = useState("");
	const [option, optionState] = useState("js");

	function parse() {
		switch (option) {
			case "js":
				try {
					outputState(javascript(input))
				} catch(e) {
					outputState("Unable to parse")
				}
				return
			case "go":
				try {
					outputState(go(input))
				} catch(e) {
					outputState("Unable to parse")
				}
				return
		}
	}

  return (
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-2">
        <Head>
          <title>M1 Dev Tools</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="md:flex md:items-center md:justify-between mt-4 mb-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Sneaker Dev Tools</h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              type="button"
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Github (soon)
            </button>
          </div>
        </div>

		<div className="flex flex-row space-x-12">
			<div className="mt-1 sm:mt-0 sm:col-span-3 w-1/2">
				<p className="mt-2 text-sm text-gray-500">Input Raw Charles</p>
				<textarea
					id="inputreq"
					name="inputreq"
					rows={3}
					className="w-full shadow-sm block h-96 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
					defaultValue={input}
					onChange={(e) => inputState(e.target.value)}
				/>
			</div>
			<div className="mt-1 sm:mt-0 sm:col-span-3 w-1/2">
				<p className="mt-2 text-sm text-gray-500">Output Request</p>
				<textarea
					id="outputreq"
					name="outputreq"
					rows={3}
					className="w-full shadow-sm block h-96 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
					defaultValue={output}
					onChange={(e) => outputState(e.target.value)}
				/>
				<label htmlFor="location" className="block text-sm font-medium text-gray-700 mt-4">
					Output Language
				</label>
				<div className="md:flex md:items-center md:justify-between ">
					<select
						id="location"
						name="location"
						className="mt-1 block w-1/3 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
						defaultValue={option}
						onChange={(e) => optionState(e.target.value)}
					>
						<option value="js">Javascript</option>
						<option value="go">Go (http.Request)</option>
						<option disabled>Python (soon)</option>
					</select>
					<button
							type="button"
							className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							onClick={() => parse()}
						>
							Convert &nbsp;
						<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
						</svg>
					</button>
				</div>
			</div>
		</div>
      </div>
  )
}

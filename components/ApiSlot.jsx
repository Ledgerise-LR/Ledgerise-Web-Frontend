
import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { Accordion, CodeArea } from 'web3uikit';


export default function ApiSlot({ title, method, url, description, importantNote, parameters, resEx, header }) {

  const [language, setLanguage] = useState("js");

  const [code, setCode] = useState(
    `const axios = require('axios')\n\nconst url = \`${url}\`\nconst header = \"${header == "formdata" ? "multipart/formdata" : "application/json"}\"\n${header == "formdata" ? "\nconst formdata = new FormData()\n" : ""}\naxios.${method.toLowerCase()}(url${method=="POST"? header == "formdata" ? ", formdata" : ", { parameters }" :""})\n   .then(res => {\n\n      const data = res.data\n      // Run the rest of the code with data\n})\n`
  );

  useEffect(() => {
    setCode(`const axios = require('axios')\n\nconst url = \`${url}\`\nconst header = \"${header == "formdata" ? "multipart/formdata" : "application/json"}\"\n${header == "formdata" ? "\nconst formdata = new FormData()\n" : ""}\naxios.${method.toLowerCase()}(url${method=="POST"? header == "formdata" ? ", formdata" : ", { parameters }" :""})\n   .then(res => {\n\n      const data = res.data\n      // Run the rest of the code with data\n})\n`)
  }, [title])

  return (
    <div className="flex">
      <div className='w-7/12 overflow-y-scroll h-full p-8 flex flex-col'>
        <div>
          <div className='text-3xl mb-4 text-gray-600 font-medium'>{title}</div>
          <div className='flex w-full items-baseline'>
            {
              method == "GET"
                ? <div className='w-fit h-4 mr-2 bg-green-700 text-slate-50 text-xxs flex justify-between items-center px-3 py-0.5 rounded-full'>GET</div>
                : <div className='w-fit h-4 mr-2 bg-blue-600 text-slate-50 text-xxs flex justify-between items-center px-3 py-0.5 rounded-full'>POST</div>
            }
            <div className='text-slate-600 text-sm'>{url}</div>
          </div>
        </div>
        <div className='mt-4'>
          <div className='text-lg mb-4 text-slate-500'>{title}</div>
          <hr />
          <div className='mt-2 text-gray-700 text-sm'>{description}</div>
          <div className='mt-4 text-gray-700 text-sm'>{importantNote}</div>
          <div className='mt-4 mb-8'>
            <div className='uppercase text-xs mb-4'>Parametreler</div>
            <div className='w-full h-fit flex flex-col bg-gray-50 border rounded-lg'>
              {
                parameters && parameters.length > 0
                ? parameters.map(eachParameter => {
                  return (
                    <div className='w-full h-fit p-4 border-b'>
                    <div className='flex items-baseline'>
                      <div className='font-semibold mr-2 text-sm'>{eachParameter[0]}</div>
                      <div className='text-xs text-slate-400 mr-2'>{eachParameter[1]}</div>
                      {
                        eachParameter[3]
                          ? <div className='text-xs text-orange-600'>required</div>
                          : <div className='text-xs text-orange-600'>not required</div>
                      }
                    </div>
                    <div className="text-sm">{eachParameter[2]}</div>
                    {
                      eachParameter[1] == "object" || eachParameter[1] == "array"
                        ? eachParameter[4].map(eachParameterSub1 => {
                          return (<div className='w-full h-fit p-4 border-b'>
                          <div className='flex items-baseline'>
                            <div className='font-semibold mr-2 text-sm'>{eachParameterSub1[0]}</div>
                            <div className='text-xs text-slate-400 mr-2'>{eachParameterSub1[1]}</div>
                            {
                              eachParameterSub1[3]
                                ? <div className='text-xs text-orange-600'>required</div>
                                : <div className='text-xs text-orange-600'>not required</div>
                            }
                          </div>
                          <div className="text-sm">{eachParameterSub1[2]}</div>
                          {
                            eachParameterSub1[1] == "object"
                            ? eachParameterSub1[4].map(eachParameterSub2 => {
                              return (<div className='w-full h-fit p-4 border-b'>
                              <div className='flex items-baseline'>
                                <div className='font-semibold mr-2 text-sm'>{eachParameterSub2[0]}</div>
                                <div className='text-xs text-slate-400 mr-2'>{eachParameterSub2[1]}</div>
                                {
                                  eachParameterSub2[3]
                                    ? <div className='text-xs text-orange-600'>required</div>
                                    : <div className='text-xs text-orange-600'>not required</div>
                                }
                              </div>
                              <div className="text-sm">{eachParameterSub2[2]}</div>
                            </div>)
                            })
                            : ("")
                          }
                        </div>)
                        })
                        : ("")
                    }
                  </div>
                  )
                })
                : (
                  <div className="m-4">Herhangi bir parametre girdisine gerek yoktur</div>
                )
              }
            </div>
          </div>
          <hr />
          <div className='mt-8 mb-12'>
            <div className='uppercase text-xs mb-4'>RESPONSE ÖRNEĞİ</div>

              <Accordion
                id="accordion"
                subTitle="OK"
                tagText="200"
                theme="green"
                title="Success"                    
              >
                <div className='w-full p-4'>
                  <div className='uppercase text-xs mb-4'>RESPONSE BODY</div>
                  <div className='h-96 overflow-y-scroll p-4 pb-12 bg-gray-50 rounded-lg border'>
                    {
                      resEx
                      ? resEx.map(eachSlot => {
                        return (
                          <div className='w-full border rounded-lg mb-2 p-4'>
                            <div className='flex w-full'>
                              <div className='mr-2 font-semibold text-sm'>{eachSlot[0]}</div>
                              <div className="text-sm">{eachSlot[1]}</div>
                            </div>
                            {
                              eachSlot[1] == "Array"
                                ? eachSlot[2].map(eachArrayObject => {
                                  return eachArrayObject
                                    ? (
                                      <div className='flex w-full ml-4 text-sm border p-4 mt-2 rounded-lg'>
                                        <div className='mr-2 text-sm font-semibold'>{eachArrayObject[0]}</div>
                                        <div>{eachArrayObject[1] || 1}</div>
                                      </div>
                                    )
                                    : ("")
                                  
                                })
                                : ("")
                            }
                          </div>
                        )
                      })
                      : ("")
                    }
                  </div>
                </div>
              </Accordion>
              <div className='my-2'></div>
              <Accordion
                id="accordion"
                subTitle="bad request"
                tagText="400"
                theme="red"
                title="Error"                    
              >

              </Accordion>
          </div>
        </div>
      </div>
      <div className="w-5/12 h-full p-8">
        <div className="text-xs uppercase text-gray-600 font-medium">Language</div>
        <div className={`w-full flex my-2 items-center`}>
          <div className={`flex flex-col items-center mr-2 cursor-pointer rounded-md p-4 ${language == "js" ? "border" : ""}`} onClick={() => {
            setCode(`const axios = require('axios')\n\nconst url = \`${url}\`\nconst header = \"${header == "formdata" ? "multipart/formdata" : "application/json"}\"\n${header == "formdata" ? "\nconst formdata = new FormData()\n" : ""}\naxios.${method.toLowerCase()}(url${method=="POST"? header == "formdata" ? ", formdata" : ", { parameters }" :""})\n   .then(res => {\n\n      const data = res.data\n      // Run the rest of the code with data\n})\n`)
            setLanguage("js")
            }}>
            <i class="devicon-javascript-plain colored"></i>
            <div className="text-xs mt-1">JavaScript</div>
          </div>
          <div className={`flex flex-col items-center mr-2 cursor-pointer rounded-md p-4 ${language == "py" ? "border" : ""}`} onClick={() => {
            setCode(`import requests\n\nurl = \"${url}\"\nheader = \"${header == "formdata" ? "multipart/formdata" : "application/json"}\"\n\nresponse = requests.${method.toLowerCase()}(url${method=="POST"? header == "formdata" ? ", data={ parameters }, files=files" : ", { parameters }" :""})\ndata = response.data\n// Run the rest of the code with data\n`)
            setLanguage("py")
            }}>
            <i class="devicon-python-plain"></i>
            <div className="text-xs mt-1">Python</div>
          </div>
        </div>
        <div className="w-full h-96">
          <CodeArea
            headerComponent={<div className="text-sm">{language}</div>}
            isMaximized={true}
            onBlur={function noRefCheck(){}}
            onChange={(e) => setCode(e.target.value)}
            text={code}
          />
        </div>
      </div>
    </div>
  )
}

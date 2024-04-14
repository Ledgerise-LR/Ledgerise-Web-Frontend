
export default function ApiTab({ title, method }) {
  return (
    <div className='pl-2 flex justify-between items-baseline mb-2 cursor-pointer'>
      <div>{title}</div>
      {
        method == "GET"
          ? <div style={{fontSize: "10px"}} className='bg-green-700 text-slate-50 text-xxs flex justify-between items-center px-3 py-0.5 rounded-full'>GET</div>
          : <div style={{fontSize: "10px"}} className='bg-blue-600 text-slate-50 text-xxs flex justify-between items-center px-3 py-0.5 rounded-full'>POST</div>
      }
    </div>
  )
}
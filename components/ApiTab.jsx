
export default function ApiTab({ title, method }) {
  return (
    <div className='pl-2 pt-2 flex text-sm justify-between items-baseline mb-2 cursor-pointer mr-2'>
      <div>{title}</div>
      {
        method == "GET"
          ? <div className='bg-green-700 text-slate-50 text-xxs flex justify-between items-center px-3 h-4 rounded-full'>GET</div>
          : <div className='bg-blue-600 text-slate-50 text-xxs flex justify-between items-center px-2 h-4 rounded-full'>POST</div>
      }
    </div>
  )
}
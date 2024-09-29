
export default function AuctionBox({ image, name, role, bio }) {

  return (
    <div className="w-72 mx-4 z-30 shadow-lg overflow-hidden rounded">
      <div className="w-full relative">
        <div className="flex justify-center items-baseline min-h-60 max-h-60 overflow-hidden bg-gray-100">
          <img className="w-full" src={`${image}`} alt={name} />
        </div>
        <div className="w-full bottom-0 flex flex-col bg-gray-200 p-2">
          <div className="text font-medium text-gray-800">{name}</div>
          <div className="text-sm text-gray-700">{role}</div>
        </div>
      </div>
      <div className="w-full bg-white bg-opacity-25 text-sm p-4 min-h-36 text-gray-700">{bio}</div>
    </div>
  )
}

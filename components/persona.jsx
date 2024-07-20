
export default function AuctionBox({ image, name, role, bio }) {

  return (
    <div className="w-60 mx-12 z-30 rounded-lg overflow-hidden">
      <div className="w-full relative">
        <img className="w-full" src={`${image}`} alt={name} />
        <div className="w-full absolute bottom-0 flex flex-col bg-gray-800 bg-opacity-40 p-2">
          <div className="text-sm font-medium text-gray-100">{name}</div>
          <div className="text-sm text-gray-300">{role}</div>
        </div>
      </div>
      <div className="w-full bg-white bg-opacity-25 text-sm p-4 text-gray-700">{bio}</div>
    </div>
  )
}

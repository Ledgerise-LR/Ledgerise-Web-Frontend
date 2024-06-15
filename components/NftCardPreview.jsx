
import { Blockie } from "web3uikit";

export default function NFTCardPreview({ price, charityAddress, companyName, availableEditions, tokenName, tokenDescription, tokenImage }) {

  function prettyAddress(address) {
    return address.slice(0, 6) + "..." + address.slice(address.length - 6, address.length)
  }

  return (
    <div>
      <div>
          <div>
            <div className="flex flex-col border-2">
              <div className="italic text-sm">
                <div className="w-full aspect-square flex flex-1 justify-center border-b-2 relative overflow-hidden bg-slate-50">
                  {
                    tokenImage
                      ? <img className="absolute" src={tokenImage} />
                      : ("")
                  }
                </div>
              </div>
              <div className="p-4">
                <div className={`text-slate-800 text-2xl uppercase font-medium mt-2 ${!tokenName ? "h-8 w-full bg-slate-100" : ""}`}>{tokenName}</div>
                <div className={`text-slate-500 mt-1 text-xs ${!price ? "w-2/3 h-4 bg-slate-100" : ""}`}>
                  {price ? "Listelenen bağış tutarı" : ""}
                </div>
                <div className={`text-slate-700 text-2xl mt-1 font-medium ${!price ? "h-8 bg-slate-100 w-1/4" : ("")}`}>{price ? (Number(price) + "TL") : ""}</div>
                <div className="text-slate-500 mt-2 mb-2 text-sm">
                  <span className="text-slate-600 font-medium">{availableEditions} </span>
                  {availableEditions ? "mevcut stok" : ""}
                </div>
                <div className="flex flex-1 items-center mt-4 mb-3">
                  <div>
                    <Blockie seed={charityAddress} size={7} />
                  </div>
                  <div className="ml-3 text-xs text-slate-500">
                    <div>{companyName}</div>
                    <div className="text-slate-600">{prettyAddress(charityAddress)}</div>
                  </div>
                </div>
                <div className="text-slate-600 mt-5 border-t-2 pt-2 text-sm">{tokenDescription}</div>
              </div>
            </div>
          </div>
      </div>
    </div>
  )
}

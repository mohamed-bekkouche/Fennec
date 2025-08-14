

const Loader = ({ screen = false }: { screen?: boolean }) => {
    return (<div className={`bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center ${screen ? "h-screen" : "h-full"} `}>
        <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Loading your order...</p>
        </div>
    </div>)
}
export default Loader
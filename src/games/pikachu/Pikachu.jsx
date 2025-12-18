import { Link } from 'react-router-dom';
import { getAssetUrl } from '../../utils/assets';

const Pikachu = () => {
    return (
        <div className="min-h-screen bg-gaming-dark flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-900/10 via-gaming-dark to-gaming-dark -z-10" />

            <div className="flex flex-col items-center w-full max-w-4xl h-full">
                <div className="w-full flex justify-between items-center mb-8 px-4">
                    <Link to="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 font-bold">
                        ← BACK TO HOME
                    </Link>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
                        PIKACHU VOLLEYBALL
                    </h1>
                </div>

                <div className="bg-gaming-card p-2 rounded-xl shadow-2xl border border-gaming-900 overflow-hidden transform hover:scale-[1.01] transition-transform duration-500 w-full max-w-[864px]">
                    <div className="aspect-[432/304] w-full bg-black relative">
                        <iframe
                            src={getAssetUrl('/pikachu-volleyball/index.html')}
                            className="absolute inset-0 w-full h-full border-0"
                            title="Pikachu Volleyball"
                            scrolling="no"
                        />
                    </div>
                </div>

                <div className="mt-8 text-center text-gray-500 max-w-md">
                    <p className="mb-2 font-bold text-gray-400">Controls:</p>
                    <div className="grid grid-cols-2 gap-8 text-sm text-left mx-auto w-fit">
                        <div>
                            <p className="text-yellow-500 font-bold mb-1">Player 1</p>
                            <p>Move: Arrow Keys</p>
                            <p>Smash: Enter</p>
                        </div>
                        <div>
                            <p className="text-red-500 font-bold mb-1">Player 2</p>
                            <p>Move: D, F, G, R</p>
                            <p>Smash: Z</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pikachu;

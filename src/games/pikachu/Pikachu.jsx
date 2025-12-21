import React from 'react';
import { Link } from 'react-router-dom';
import { getAssetUrl } from '../../utils/assets';
import GameTutorial from '../../components/GameTutorial';

const Pikachu = () => {
    // Touch Controls
    const iframeRef = React.useRef(null);
    const touchStartRef = React.useRef({ x: 0, y: 0, time: 0 });
    const activeKeysRef = React.useRef(new Set());
    const containerRef = React.useRef(null);

    // Helper to send keys to iframe
    const sendKey = (type, keyCode, key) => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage({ type, keyCode, key }, '*');
        }
    };

    // Keyboard event handler
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            // Prevent default for arrow keys and Enter to avoid page scrolling
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', ' '].includes(e.key)) {
                e.preventDefault();
            }

            // Send key to iframe
            const keyMap = {
                'ArrowUp': { keyCode: 38, key: 'ArrowUp' },
                'ArrowDown': { keyCode: 40, key: 'ArrowDown' },
                'ArrowLeft': { keyCode: 37, key: 'ArrowLeft' },
                'ArrowRight': { keyCode: 39, key: 'ArrowRight' },
                'Enter': { keyCode: 13, key: 'Enter' },
                'd': { keyCode: 68, key: 'd' },
                'D': { keyCode: 68, key: 'd' },
                'f': { keyCode: 70, key: 'f' },
                'F': { keyCode: 70, key: 'f' },
                'g': { keyCode: 71, key: 'g' },
                'G': { keyCode: 71, key: 'g' },
                'r': { keyCode: 82, key: 'r' },
                'R': { keyCode: 82, key: 'r' },
                'z': { keyCode: 90, key: 'z' },
                'Z': { keyCode: 90, key: 'z' }
            };

            if (keyMap[e.key]) {
                sendKey('keydown', keyMap[e.key].keyCode, keyMap[e.key].key);
            }
        };

        const handleKeyUp = (e) => {
            const keyMap = {
                'ArrowUp': { keyCode: 38, key: 'ArrowUp' },
                'ArrowDown': { keyCode: 40, key: 'ArrowDown' },
                'ArrowLeft': { keyCode: 37, key: 'ArrowLeft' },
                'ArrowRight': { keyCode: 39, key: 'ArrowRight' },
                'Enter': { keyCode: 13, key: 'Enter' },
                'd': { keyCode: 68, key: 'd' },
                'D': { keyCode: 68, key: 'd' },
                'f': { keyCode: 70, key: 'f' },
                'F': { keyCode: 70, key: 'f' },
                'g': { keyCode: 71, key: 'g' },
                'G': { keyCode: 71, key: 'g' },
                'r': { keyCode: 82, key: 'r' },
                'R': { keyCode: 82, key: 'r' },
                'z': { keyCode: 90, key: 'z' },
                'Z': { keyCode: 90, key: 'z' }
            };

            if (keyMap[e.key]) {
                sendKey('keyup', keyMap[e.key].keyCode, keyMap[e.key].key);
            }
        };

        // Add event listeners
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // Focus container on mount
        if (containerRef.current) {
            containerRef.current.focus();
        }

        // Cleanup
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    const handleTouchStart = (e) => {
        touchStartRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
            time: Date.now()
        };
    };

    const handleTouchMove = (e) => {
        if (!touchStartRef.current) return;

        // Prevent scrolling while playing
        if (e.cancelable) e.preventDefault();

        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;

        const deltaX = currentX - touchStartRef.current.x;
        const deltaY = currentY - touchStartRef.current.y;

        const threshold = 30; // px to trigger move

        const newActiveKeys = new Set();

        // Horizontal
        if (deltaX > threshold) {
            newActiveKeys.add('ArrowRight');
            if (!activeKeysRef.current.has('ArrowRight')) sendKey('keydown', 39, 'ArrowRight');
        } else if (deltaX < -threshold) {
            newActiveKeys.add('ArrowLeft');
            if (!activeKeysRef.current.has('ArrowLeft')) sendKey('keydown', 37, 'ArrowLeft');
        }

        // Vertical
        if (deltaY > threshold) {
            newActiveKeys.add('ArrowDown');
            if (!activeKeysRef.current.has('ArrowDown')) sendKey('keydown', 40, 'ArrowDown');
        } else if (deltaY < -threshold) {
            newActiveKeys.add('ArrowUp');
            if (!activeKeysRef.current.has('ArrowUp')) sendKey('keydown', 38, 'ArrowUp');
        }

        // Release keys that are no longer active
        activeKeysRef.current.forEach(key => {
            if (!newActiveKeys.has(key)) {
                const codeMap = { 'ArrowRight': 39, 'ArrowLeft': 37, 'ArrowDown': 40, 'ArrowUp': 38 };
                sendKey('keyup', codeMap[key], key);
            }
        });

        activeKeysRef.current = newActiveKeys;
    };

    const handleTouchEnd = (e) => {
        const endTime = Date.now();
        const duration = endTime - touchStartRef.current.time;

        // Release all movement keys
        activeKeysRef.current.forEach(key => {
            const codeMap = { 'ArrowRight': 39, 'ArrowLeft': 37, 'ArrowDown': 40, 'ArrowUp': 38 };
            sendKey('keyup', codeMap[key], key);
        });
        activeKeysRef.current.clear();

        // Tap Detection for Smash (Enter)
        // If short duration and no movement keys were triggered (or very small movement)
        const touchEnd = e.changedTouches[0];
        const dist = Math.sqrt(
            Math.pow(touchEnd.clientX - touchStartRef.current.x, 2) +
            Math.pow(touchEnd.clientY - touchStartRef.current.y, 2)
        );

        if (duration < 300 && dist < 10) {
            // Tap detected - Smash!
            sendKey('keydown', 13, 'Enter');
            setTimeout(() => sendKey('keyup', 13, 'Enter'), 100);
        }
    };

    return (
        <div
            ref={containerRef}
            tabIndex={0}
            className="min-h-screen bg-gaming-dark flex flex-col items-center justify-center p-4 relative overflow-hidden outline-none"
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-900/10 via-gaming-dark to-gaming-dark -z-10" />

            {/* Hint for mobile users */}
            <div className="lg:hidden absolute top-4 left-0 right-0 text-center z-20 pointer-events-none animate-pulse">
                <p className="text-yellow-400 text-xs font-mono bg-black/50 inline-block px-3 py-1 rounded-full">
                    👆 Slide to Move • Tap to Smash
                </p>
            </div>

            <div className="flex flex-col items-center w-full max-w-4xl h-full">
                <div className="w-full flex justify-between items-center mb-4 lg:mb-8 px-4">
                    <Link to="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 font-bold z-20">
                        ← BACK
                    </Link>
                    <h1 className="text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
                        PIKACHU VOLLEYBALL
                    </h1>
                </div>

                <GameTutorial game="pikachu" />

                <div
                    className="bg-gaming-card p-1 lg:p-2 rounded-xl shadow-2xl border border-gaming-900 overflow-hidden relative w-full max-w-[864px]"
                >
                    {/* Touch Overlay */}
                    <div
                        className="absolute inset-0 z-10 touch-none"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    />

                    <div className="aspect-[432/304] w-full bg-black relative">
                        <iframe
                            ref={iframeRef}
                            src={getAssetUrl('/pikachu-volleyball/index.html')}
                            className="absolute inset-0 w-full h-full border-0 pointer-events-none" // Disable direct pointer events on iframe so overlay captures them
                            title="Pikachu Volleyball"
                            scrolling="no"
                        />
                    </div>
                </div>

                <div className="mt-8 text-center text-gray-500 max-w-md hidden lg:block">
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

import { motion } from 'framer-motion';
import { useState } from 'react';

const GameTutorial = ({ game }) => {
    const [isOpen, setIsOpen] = useState(false);

    const tutorials = {
        '2048': {
            title: '2048 遊戲教學',
            goal: '合併相同數字的方塊，目標是創造出 2048 方塊！',
            controls: {
                desktop: [
                    { key: '↑ ↓ ← →', desc: '使用方向鍵移動所有方塊' }
                ],
                mobile: [
                    { key: '滑動', desc: '上下左右滑動螢幕移動方塊' }
                ]
            },
            tips: [
                '相同數字的方塊碰撞會合併成更大的數字',
                '每次移動後會隨機生成新方塊（2 或 4）',
                '盡量將大數字集中在角落',
                '當棋盤填滿且無法移動時遊戲結束'
            ]
        },
        'tetris': {
            title: 'Tetris 遊戲教學',
            goal: '旋轉並排列下落的方塊，消除完整的橫列得分！',
            controls: {
                desktop: [
                    { key: '← →', desc: '左右移動方塊' },
                    { key: '↑', desc: '旋轉方塊' },
                    { key: '↓', desc: '加速下落' },
                    { key: 'Space', desc: '直接落到底部 (Hard Drop)' }
                ],
                mobile: [
                    { key: '左右滑', desc: '移動方塊' },
                    { key: '上滑', desc: '旋轉方塊' },
                    { key: '下滑', desc: '加速下落' },
                    { key: '雙擊', desc: '直接落到底部' }
                ]
            },
            tips: [
                '消除一行得分，同時消除多行得分更高',
                '每消除 10 行會提升等級，方塊下落速度加快',
                '盡量避免堆疊過高',
                '善用 Hard Drop 快速放置方塊'
            ]
        },
        'pikachu': {
            title: 'Pikachu Volleyball 遊戲教學',
            goal: '操控皮卡丘打排球，讓球落在對方場地得分！',
            controls: {
                desktop: [
                    { key: 'Player 1', desc: '' },
                    { key: '↑ ↓ ← →', desc: '方向鍵移動' },
                    { key: 'Enter', desc: '扣球/跳躍' },
                    { key: '', desc: '' },
                    { key: 'Player 2', desc: '' },
                    { key: 'D F G R', desc: '移動' },
                    { key: 'Z', desc: '扣球/跳躍' }
                ],
                mobile: [
                    { key: '滑動', desc: '移動皮卡丘' },
                    { key: '點擊', desc: '扣球/跳躍' }
                ]
            },
            tips: [
                '讓球落在對方場地得 1 分',
                '先達到 15 分的玩家獲勝',
                '跳起來扣球威力更強',
                '注意球的彈跳軌跡'
            ]
        }
    };

    const tutorial = tutorials[game];
    if (!tutorial) return null;

    return (
        <div className="w-full max-w-2xl mx-auto mb-8">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-gaming-800/50 hover:bg-gaming-700/50 border border-gaming-500/30 rounded-lg p-4 flex items-center justify-between transition-all"
            >
                <div className="flex items-center gap-3">
                    <span className="text-2xl">📖</span>
                    <span className="text-white font-bold">遊戲教學</span>
                </div>
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    className="text-white text-xl"
                >
                    ▼
                </motion.span>
            </button>

            <motion.div
                initial={false}
                animate={{
                    height: isOpen ? 'auto' : 0,
                    opacity: isOpen ? 1 : 0
                }}
                className="overflow-hidden"
            >
                <div className="bg-gaming-800/30 border border-gaming-500/20 rounded-b-lg p-6 space-y-6">
                    {/* Goal */}
                    <div>
                        <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                            <span>🎯</span> 遊戲目標
                        </h3>
                        <p className="text-gray-300">{tutorial.goal}</p>
                    </div>

                    {/* Controls */}
                    <div>
                        <h3 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
                            <span>🎮</span> 操作方式
                        </h3>

                        {/* Desktop */}
                        <div className="mb-4">
                            <p className="text-gray-400 text-sm mb-2">💻 電腦版</p>
                            <div className="space-y-2">
                                {tutorial.controls.desktop.map((control, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        {control.key && (
                                            <>
                                                <kbd className="bg-gaming-900 px-3 py-1 rounded border border-gaming-500/50 text-white font-mono text-sm min-w-[80px] text-center">
                                                    {control.key}
                                                </kbd>
                                                {control.desc && <span className="text-gray-300">{control.desc}</span>}
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mobile */}
                        <div>
                            <p className="text-gray-400 text-sm mb-2">📱 手機版</p>
                            <div className="space-y-2">
                                {tutorial.controls.mobile.map((control, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <kbd className="bg-gaming-900 px-3 py-1 rounded border border-gaming-500/50 text-white font-mono text-sm min-w-[80px] text-center">
                                            {control.key}
                                        </kbd>
                                        <span className="text-gray-300">{control.desc}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tips */}
                    <div>
                        <h3 className="text-green-400 font-bold mb-3 flex items-center gap-2">
                            <span>💡</span> 遊戲技巧
                        </h3>
                        <ul className="space-y-2">
                            {tutorial.tips.map((tip, i) => (
                                <li key={i} className="text-gray-300 flex items-start gap-2">
                                    <span className="text-green-400 mt-1">•</span>
                                    <span>{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default GameTutorial;

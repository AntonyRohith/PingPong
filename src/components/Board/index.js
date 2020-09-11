import React, { useState, useEffect } from 'react';

import './board.css';

export default () => {

    const [size, setSize] = useState();

    const [ball, setball] = useState();

    useEffect(() => {
        const controller = document.getElementById('user');
        setSize({
            boardTop: document.getElementsByClassName('board-container')[0].getBoundingClientRect().top,
            ballSize: document.getElementById('ball').offsetHeight,
            ctrlWidth: controller.offsetWidth,
            ctrlHeight: controller.offsetHeight
        });
        initBall();
    }, []);

    const initBall = () => {
        setball({
            topSpeed: 3,
            leftSpeed: 3,
            top: window.innerHeight / 2,
            left: window.innerWidth / 2,
            intervalId: null
        });
    };

    const controlPaddle = (event) => {
        let move = event.clientY - (size.boardTop + size.ctrlHeight / 2);
        move = move > 0 ? move : 0;
        move = event.clientY < (window.innerHeight - size.ctrlHeight / 2) ? move : (window.innerHeight - size.boardTop - size.ctrlHeight);
        document.getElementById('user').style.transform = 'translateY(' + move + 'px)';
    };

    const moveBall = () => {
        setball({ ...ball, intervalId: setInterval(startGame, 10) });
    };

    const startGame = () => {
        setball(oldBall => {
            let newBall = { ...oldBall, left: oldBall.left + oldBall.leftSpeed, top: oldBall.top + oldBall.topSpeed };

            const topCalc = size.boardTop + newBall.top;
            const widthCalc = window.innerWidth - size.ballSize - size.ctrlWidth;
            const heightCalc = window.innerHeight - size.ballSize - size.boardTop;

            newBall = (newBall.top >= heightCalc) ? { ...newBall, top: heightCalc, topSpeed: -oldBall.topSpeed } : newBall;
            //newBall = (newBall.left >= widthCalc) ? { ...newBall, left: widthCalc, leftSpeed: -oldBall.leftSpeed } : newBall;
            newBall = (newBall.top <= 0) ? { ...newBall, topSpeed: Math.abs(oldBall.topSpeed), top: 0 } : newBall;
            newBall = (newBall.left <= 0) ? { ...newBall, leftSpeed: Math.abs(oldBall.leftSpeed), left: 0 } : newBall;
            if (newBall.left <= size.ctrlWidth) {
                // const ctrlPos = document.getElementById('user').getBoundingClientRect();
                // if (topCalc >= ctrlPos.y && topCalc <= (ctrlPos.y + size.ctrlHeight))
                //     newBall = { ...newBall, leftSpeed: Math.abs(oldBall.leftSpeed), left: 0 };
                // else
                //     stopGame(oldBall.intervalId);
            }
            if (newBall.left >= widthCalc) {
                const ctrlPos = document.getElementById('user').getBoundingClientRect();
                if (topCalc >= ctrlPos.y && topCalc <= (ctrlPos.y + size.ctrlHeight))
                    newBall = { ...newBall, left: widthCalc, leftSpeed: -oldBall.leftSpeed };
                else{
                    newBall = { ...newBall, left: widthCalc+ size.ctrlWidth,  };
                    stopGame(oldBall.intervalId);
                }
            }
            return newBall;
        });
    };

    const stopGame = (id, pos) => {
        clearInterval(id);
        setTimeout(() => initBall(), 2000);
    }

    return (
        <div className="board-container" onMouseMove={controlPaddle}>
            <div id="bot" className="controller"></div>
            <div id="ball" style={ball} onClick={moveBall}> </div>
            <div id="user" className="controller"></div>
        </div >
    );
}


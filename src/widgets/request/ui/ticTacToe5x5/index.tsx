import { AxiosResponse } from 'axios';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import React, {useEffect, useState} from 'react';
import { IRequestDetails, REQUEST_STATUS_COLOR, REQUEST_STATUS_TITLE, requestApi } from 'entities/request';
import { Container, Typography, Button, Descriptions, Divider, Skeleton, Upload } from 'shared/ui';
import {Space} from "antd";
import Board from './Board';
type PropTypes = {
    apiFunc?: (id: string) => Promise<AxiosResponse<IRequestDetails>>,
    setTitle?: (title: string) => void
}

const UNDEFINED_TITLE = 'N/A';

export const TicTacToe5x5 = ({ apiFunc = requestApi.getRequestDetails, setTitle }: PropTypes) => {
    const { id } = useParams();
    const { data, isLoading, isError } = useQuery({
            queryKey: [id, 'requestId'],
            queryFn: () => apiFunc(`${id}`),
            select: data1 => data1.data,
            onSuccess: data1 => {
                if (setTitle) setTitle(data1?.object || UNDEFINED_TITLE);
            }
        }
    );

    const [tableData, setTableData] = useState<any[]>([]);
    const [currentPlayer, setCurrentPlayer] = useState<string>('X');
    const [winner, setWinner] = useState<string | null>(null);
    const [resultText, setResultText] = useState<string | null>(null);
    const [board, setBoard] = useState<Array<string | null>>(Array(24).fill(null));
    const [board2, setBoard2] = useState<Array<string | null>>(Array(24).fill(null));

    const [countWinX, setCountWinX] =  useState<number>(0);
    const [countWinO, setCountWinO] =  useState<number>(0);


    const handleCellClick = async (index: number)=> {
        console.log('index', index)

        const res = await requestApi.createGameTicTacToe5x5Move(String(id), index);

        if (board[index] || winner) {
            return;
        }

        const res2 = await requestApi.getGameTicTacToe5x5(String(id));
        if (res2.data.board) setBoard2(res2.data.board);

        const newWinner = res2.data.winner;

        setCountWinX(res2.data.countWinX);
        setCountWinO(res2.data.countWinO);
        if (newWinner) {
            setWinner(newWinner);
            setResultText(res2.data.result);
        } else {
            setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
        }
    };

    useEffect(() => {

        const fetchData = async () => {
            try {
                const res = await requestApi.getGameTicTacToe5x5(String(id));

                if (res.data.board) setBoard2(res.data.board);

                const newWinner = res.data.winner;

                setCountWinX(res.data.countWinX);
                setCountWinO(res.data.countWinO);

                if (newWinner) {
                    setWinner(newWinner);
                    setResultText(res.data.result);

                } else {
                    if (res.data.result)
                        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
                    setResultText(res.data.result);
                }

            } catch (error) {
                console.error(error);
            }
        };

        fetchData();

        const intervalId = setInterval(() => {

            fetchData();
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div>
            <div className="app">
                <h1>Tic Tac Toe 5x5</h1>
                <Space size={'middle'}>
                    <Typography.Title level={5} $noMargin>
                        countWinX: {countWinX}
                    </Typography.Title>
                    <Typography.Title level={5} $noMargin>
                        countWinO: {countWinO}
                    </Typography.Title>
                </Space>

                {winner ? (
                    <>
                        <p>Winner: {winner}</p>

                    </>
                ) : (
                    <p></p>
                )}
                {resultText ? (
                    <>
                        <p>Result: {resultText}</p>

                    </>
                ) : (
                    <p></p>
                )}

                <Board board={board2} onCellClick={handleCellClick} />
            </div>
        </div>
    );
};


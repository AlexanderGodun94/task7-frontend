import { AxiosResponse } from 'axios';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import React, {useEffect, useState} from 'react';
import { IRequestDetails, REQUEST_STATUS_COLOR, REQUEST_STATUS_TITLE, requestApi } from 'entities/request';
import { Container, Typography, Button, Descriptions, Divider, Skeleton, Upload } from 'shared/ui';
import { displayConstValue, displayDate, getUrlName } from 'shared/lib';
import { API_URL } from 'shared/config';
import { DownloadOutlined } from 'shared/icons';
import Board from './Board';
import {authApi} from "../../../auth/api";

type PropTypes = {
  apiFunc?: (id: string) => Promise<AxiosResponse<IRequestDetails>>,
  setTitle?: (title: string) => void
}

const UNDEFINED_TITLE = 'N/A';
export const RequestDetails = ({ apiFunc = requestApi.getRequestDetails, setTitle }: PropTypes) => {
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
    const [board, setBoard] = useState<Array<string | null>>(Array(9).fill(null));
    const [board2, setBoard2] = useState<Array<string | null>>(Array(9).fill(null));


    const handleCellClick = async (index: number)=> {
        console.log('index', index)

        const res = await requestApi.createGameTicTacToeMove(String(id), index);

        console.log('res', res.data);



        if (board[index] || winner) {
            return;
        }

        const res2 = await requestApi.getGameTicTacToe(String(id));
        if (res2.data.board) setBoard2(res2.data.board);

        const newWinner = res2.data.winner;

        console.log('newWinner',newWinner)

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
                const res = await requestApi.getGameTicTacToe(String(id));

                if (res.data.board) setBoard2(res.data.board);

                const newWinner = res.data.winner;

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
            <h1>Tic Tac Toe</h1>
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


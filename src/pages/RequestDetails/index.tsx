import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { InvestorRequestsTable, RequestDetails } from 'widgets/request';
import { TicTacToe5x5} from 'widgets/request';
import { requestApi } from 'entities/request';
import { Container, Breadcrumb, Skeleton } from 'shared/ui';
import {useQuery} from "@tanstack/react-query";



const UNDEFINED_TITLE = 'N/A';

export const RequestDetailsPage = ({ apiFunc = requestApi.getRequestDetails }) => {
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


    const [gameType, setGameType] = useState<string>('');
    let res = {};

    useEffect(() => {

        const getSession = async () => {
            try {
                console.log('id', id)
                const res = await requestApi.getRequestDetails(String(id));

                setGameType(res.data.gameType);

                console.log('resresres', res)


            } catch (error) {
                console.error(error);
            }
        };
        getSession();

    }, []);



  const [title, setTitle] = useState('');
    return (
        <div>
            <Breadcrumb
                items={[
                    {title: <Link to={'/'}>Profile</Link>},
                    {title: <Link to={'/'}>Session</Link>},
                ]}
            />

            {gameType === 'tic-tac-toe' ? (
                <>
                    <RequestDetails
                        setTitle={setTitle}
                    />

                </>
            ) : (
                <p></p>
            )}
            {gameType === 'tic-tac-toe-5x5' ? (
                <>
                    <TicTacToe5x5
                        setTitle={setTitle}
                    />

                </>
            ) : (
                <p></p>
            )}



      <Container marginTop={48}>
        {/*<InvestorRequestsTable*/}
          {/*title={'Previous requests'}*/}
          {/*queryParams={{ requestId: id }}*/}
          {/*disableFilters*/}
        {/*/>*/}
      </Container>
    </div>
  );
};


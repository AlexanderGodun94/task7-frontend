import React from 'react';
import { API_URL } from 'shared/config';
import {Button, Form, Input, Row, Space, Table, Select} from 'antd';
import {displayDate, getErrorText} from '../../../../shared/lib';
import { GetRequestsApiParams, IRequest, REQUEST_STATUS_COLOR, REQUEST_STATUS_TITLE, RequestStatuses } from '../..';
import { Container, Typography } from '../../../../shared/ui';
import { Filters, FormData } from '../RequestTableFilters';
import Checkbox from "antd/es/checkbox/Checkbox";
import { useEffect, useState } from 'react';
import {authApi} from "../../../../widgets/auth/api";
import {useAppProcessStore} from "../../../appProcess";
import { Link } from 'react-router-dom';

import { Collapse } from 'antd';

const { Option } = Select;

interface PropTypes<T> {
  data: IRequest[] | undefined,
  loading: boolean,
  title?: string,
  disableFilters?: boolean,
  setFilters?: (data: GetRequestsApiParams) => void,
  clearFilters?: () => void
}


export function RequestsTable<T>({data, loading, disableFilters = false, title = 'Sessions', setFilters, clearFilters}: PropTypes<T>) {



    const {setIsLoading} = useAppProcessStore();

    const [tableData, setTableData] = useState<any[]>([]);
    const [existUsers, setExistUser] = useState<string[]>([]);

    const [checkedAll, setCheckedAll] = useState(false);
    const [checkedRows, setCheckedRows] = useState<string[]>([]);

    const [gameTypes, setGameTypes] = useState<any[]>([]);
    const [selectedGameType, setSelectedGameType] = useState(null);

    const handleCheckAll = (event: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
        setCheckedAll(event.target.checked);
        setCheckedRows([]);
    };

    const handleCheckRow = (id: string) => {
        const isChecked = checkedRows.includes(id);
        if (isChecked) setCheckedRows(checkedRows.filter((checkedId) => checkedId !== id));
        else setCheckedRows([...checkedRows, id]);
    };


    const handleCreateSession = async () => {
        try {

            if (selectedGameType) {
                const res = await authApi.createSession(selectedGameType);
                console.log('res', res);
            }
            //window.location.reload();
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConnectSession = async (sessionId : string) => {
        try {

            console.log('sessionId', sessionId)

            const res = await authApi.connectSession(sessionId);
            console.log('res', res);

            //window.location.reload();
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await authApi.getSessions();
                setTableData(response.data);

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




    useEffect(() => {
        const getGameTypes = async () => {
            try {
                const response = await authApi.getGameTypes();
                const gameTypes = response.data.map((gameType) => ({
                    value: gameType.id,
                    label: gameType.name,
                }));
                setGameTypes(gameTypes);
            } catch (error) {
                console.error(error);
            }
        };
        getGameTypes();
    }, []);



        return (

        <div>

            <Container marginBottom={24}>
                {/*<Form.Item*/}
                    {/*label="Username"*/}
                    {/*name="username"*/}
                    {/*colon={false}*/}
                    {/*initialValue={''}*/}
                {/*>*/}
                    {/*<Input type="text" id="username" value={recipient}*/}
                           {/*onChange={(event) => setRecipient(event.target.value)} list="recipients"*/}
                           {/*onFocus={handleFocus}/>*/}
                    {/*<datalist id="recipients">*/}
                        {/*{existUsers.map((username) => (*/}
                            {/*<option key={username} value={username}/>*/}
                        {/*))}*/}
                    {/*</datalist>*/}
                {/*</Form.Item>*/}
                {/*<Form.Item*/}
                    {/*label="Title"*/}
                    {/*name="subject"*/}
                    {/*colon={false}*/}
                    {/*initialValue={''}*/}
                {/*>*/}
                    {/*<Input type="text" id="subject" value={subject}*/}
                           {/*onChange={(event) => setSubject(event.target.value)}/>*/}
                {/*</Form.Item>*/}

                    {/*<Input id="message" value={message} onChange={(event) => setMessage(event.target.value)}/>*/}




                <Select
                    id="game-type"
                    style={{width: 150}}
                    value={selectedGameType}
                    onChange={(value) => setSelectedGameType(value)}
                    options={gameTypes}
                >
                    {gameTypes.map((gameType) => (
                        <Option key={gameType.value} value={gameType.value}>
                            {gameType.label}
                        </Option>
                    ))}
                </Select>



                    <Button  color="inherit" onClick={() => handleCreateSession()}>Create session</Button>

            </Container>

            <Container marginBottom={24}>
                <Space size={'middle'}>
                    <Typography.Title level={3} $noMargin>
                        {title}
                    </Typography.Title>

                </Space>

            </Container>

            <Table
                dataSource={tableData}
                loading={loading}
            >

                <Table.Column
                    title={() => (
                        <Checkbox
                            onChange={handleCheckAll}
                            checked={checkedAll}/>
                    )}
                    dataIndex="id"
                    key="id"
                    render={(id) => (
                        <Checkbox
                            onChange={() => handleCheckRow(id)}
                            checked={checkedAll || checkedRows.includes(id)}
                        />
                    )}
                />

                <Table.Column title="Game" dataIndex="gameType" key="gameType"/>
                <Table.Column title="Creator" dataIndex="creator" key="creator"/>
                <Table.Column
                    title="CreatedAt"
                    dataIndex="createdAt"
                    key="date"
                    render={(date: string) => displayDate(date, true)}
                />
                {/*<Table.Column*/}
                    {/*title="Message"*/}
                    {/*dataIndex="message"*/}
                    {/*key="message"*/}

                    {/*render={(message: string, record: any) => (*/}
                        {/*<Collapse>*/}
                            {/*<Collapse.Panel header={record.title} key="message">*/}
                                {/*{message}*/}
                            {/*</Collapse.Panel>*/}
                        {/*</Collapse>*/}
                    {/*)}*/}
                {/*/>*/}
                <Table.Column
                    title="Status"
                    dataIndex="status"
                    key="status"
                    render={(status: RequestStatuses) => (
                        <Typography.Text type={REQUEST_STATUS_COLOR[status]}>
                            {REQUEST_STATUS_TITLE[status]}
                        </Typography.Text>
                    )}
                />
                <Table.Column
                    key="details"
                    align={'center'}
                    render={(request) => (

                        <Link to={`/request/${request.id}`} onClick={(e) => (request.connect === false) && e.preventDefault()}>
                            <Button type={'primary'} onClick={() => handleConnectSession(request.id)} disabled={request.connect === false} >
                                Connect
                            </Button>
                       </Link>
                    )}
                />
            </Table>

        </div>
    );
};

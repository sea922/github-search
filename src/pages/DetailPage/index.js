import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, Button, Spin } from 'antd';
import { Link } from "react-router-dom";
import {
    HomeOutlined,
    GithubOutlined,
    CalendarOutlined,
    StarFilled,
    BranchesOutlined,
    ArrowLeftOutlined
} from '@ant-design/icons';

import axios from 'utils/axios';
import useFetchDataHook from './useFetchDataHook';

const getUserInfo = (username) => {
    return axios(`/users/${username}`);
}

const getRepoList = (username, page = 1) => {
    return axios(`/users/${username}/repos?page=${page}`, {
        params: {
            type: 'owner',
            sort: 'created',
            direction: 'asc',
        }
    });
}

const formatDate = (date) => {
    if (date && typeof(date) === 'string') {
        return date.substr(0, 10).split('-').reverse().join('-');
    }
    return 'Unknown';
}

const DetailPage = () => {

    const { username } = useParams();
    const [
        getUser,
        getRepos,
        isLoading,
        setData,
        handleLoadMore
    ] = useFetchDataHook(username, getRepoList);

    useEffect(() => {
        document.title = 'Detail'
    }, []);

    const user = getUser();
    const repos = getRepos();

    useEffect(() => {
        async function getUserDetail() {
            try {
                const [userInfo, repoList] = await Promise.all([getUserInfo(username), getRepoList(username)]);
                setData(userInfo.data, repoList.data);
            } catch (error) {
                console.log(error);
            }
        }
        getUserDetail();
    }, [username, setData]);

    return (
        <div className="container mx-auto pt-8 w-100 h-100 flex flex-col items-center">
            <Spin size="large" tip="Loading" spinning={isLoading() && user === null} delay="200">
                <div
                    className="px-4 py-2 shadow-lg rounded bg-white box-border"
                    style={{ width: 600, height: 190 }}
                >
                    <Link to="/" className="text-black">
                        <ArrowLeftOutlined className="font-bold text-lg cursor-pointer" />
                    </Link>
                    {
                        user !== null
                            ? <div className="flex">
                                <Avatar size={128} src={user.avatar_url} />
                                <div className="ml-4">
                                    <p className="text-2xl font-bold mb-2">{user.name}</p>
                                    <p className="mb-1 flex items-center">
                                        <GithubOutlined />
                                        <span className="ml-2 mr-1">Profile:</span>
                                        {' '}
                                        <a href={user.html_url} target="__blank">{user.html_url}</a>
                                    </p>
                                    <p className="mb-1 flex items-center">
                                        <HomeOutlined />
                                        <span className="ml-2 mr-1">Location:</span>
                                        {' '}
                                        {user.location}
                                    </p>
                                    <p className="mb-1 flex items-center">
                                        <CalendarOutlined />
                                        <span className="ml-2 mr-1">Join at:</span>
                                        {' '}
                                        {formatDate(user.created_at)}
                                    </p>
                                    <p className="mb-1 flex items-center">
                                        <CalendarOutlined />
                                        <span className="ml-2 mr-1">Update at:</span>
                                        {' '}
                                        {formatDate(user.updated_at)}
                                    </p>
                                </div>
                            </div>
                            : null
                    }
                </div>
            </Spin>
            <Spin size="large" tip="Loading" spinning={isLoading()} delay="200">
                <div
                    className="mt-4 px-4 py-4 shadow-lg rounded overflow-y-auto scroll bg-white"
                    style={{ width: 600, height: 'calc(100vh - 250px)' }}
                >
                    <p className="font-bold mb-6">Public repo: {user?.public_repos || 0}</p>
                    {
                        repos.map((repo, index) => (
                            <div key={repo.id} className="mb-3 pb-5 justify-between" style={{ borderBottom: '1px solid #ccc' }}>
                                <p className="font-bold text-xl mb-2">
                                    <a href={repo.html_url} target="__blank">
                                        #{index + 1} - {repo.name}
                                    </a>
                                </p>
                                <p className="text-sm text-gray-600 mb-0">{repo.description || 'No description'}</p>
                                <div className="mt-5 flex items-center justify-between">
                                    {
                                        repo.language &&
                                        <p className="flex items-center mb-0 mr-6">
                                            <span className="w-4 h-4 bg-green-600 inline-block rounded-full" />
                                            <span className="ml-1 text-black">{repo.language}</span>
                                        </p>
                                    }
                                    <div className="flex items-center">
                                        <span title="Star" className="flex items-center inline-block mr-6">
                                            <StarFilled className="mr-1" /> {repo.stargazers_count}
                                        </span>
                                        <span title="Fork" className="flex items-center inline-block mr-6">
                                            <BranchesOutlined className="mr-1" /> {repo.forks}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                    {
                        repos.length < (user?.public_repos || 0)
                        && (
                            <div className="w-100 mt-4 flex justify-center">
                                <Button type="primary" onClick={handleLoadMore}>
                                    Load More
                                </Button>
                            </div>
                        )
                    }
                </div>
            </Spin>
        </div>
    );
}

export default DetailPage
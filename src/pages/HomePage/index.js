import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Input, Avatar, Button, Spin, Result } from 'antd';
import { ClearOutlined } from '@ant-design/icons'

import useFetchDataHook from './useFetchDataHook'

const HomePage = () => {

    const [keyword, setKeyword] = useState('');
    const [
        getData,
        getTotal,
        isLoading,
        isLoadSuccess,
        isLoadError,
        clearSearch,
        handleSearch,
        handleLoadMore
    ] = useFetchDataHook(keyword);

    useEffect(() => {
        document.title = 'Home'
    }, []);

    function handleInputChange(e) {
        setKeyword(e.target.value)
    }

    function handleClearSearch() {
        setKeyword('');
        clearSearch();
    }

    function render() {
        if (isLoadError()) {
            return <Result status="500" title="500" subTitle="Sorry, something went wrong." />
        }
        if (isLoadSuccess()) {
            if (getTotal() === 0) {
                return keyword === '' ? <Result title="Enter some keyword" /> : <Result title="No user found / Enter to search" />
            } else {
                return getData().map((user, index) => (
                    <div key={user.id} className="flex items-center mb-6 pb-6 justify-between" style={{ borderBottom: '1px solid #ccc' }}>
                        <div className="flex items-center">
                            <p className="mr-8 mb-0">#{index + 1}</p>
                            <Avatar src={user.avatar_url} size={48} />
                            <div className="ml-4">
                                <p className="font-bold text-base mb-0">
                                    {user.login}
                                </p>
                                <a href={user.html_url} target="__blank" className="text-sm underline">
                                    Github Link
                                </a>
                            </div>
                        </div>
                        <Button type="primary">
                            <Link to={`/detail/${user.login}`}>
                                Detail
                            </Link>
                        </Button>
                    </div>
                ));
            }
        }
    }

    return (
        <div className="container mx-auto pt-8 w-100 h-100 flex flex-col items-center">
            <div className="px-4 py-8 shadow-lg rounded flex items-center bg-white" style={{ width: 600 }}>
                <Input.Search
                    placeholder="Search by username"
                    enterButton
                    value={keyword}
                    onSearch={handleSearch}
                    onChange={handleInputChange} />
                <Button
                    className="ml-2"
                    icon={<ClearOutlined />}
                    onClick={handleClearSearch}
                >
                    Clear
                </Button>
            </div>
            <Spin size="large" tip="Loading" spinning={isLoading()} delay="200">
                <div
                    className="mt-4 px-4 py-8 shadow-lg rounded overflow-y-auto scroll bg-white"
                    style={{ width: 600, height: 'calc(100vh - 170px)' }}
                >
                    <p className="font-bold mb-6">Result found: {getTotal()}</p>
                    {render()}
                    {
                        getData().length < getTotal()
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

export default HomePage
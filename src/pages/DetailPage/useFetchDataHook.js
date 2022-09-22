import { useReducer, useCallback } from 'react';

const ITEM_PER_PAGE = 30;

const STATUS = {
    LOADING: 'loading',
    LOAD_SUCCESS: 'success',
    LOAD_ERROR: 'error',
}

const TYPE = {
    LOAD: 'LOAD',
    LOAD_SUCCESS: 'LOAD_SUCCESS',
    LOAD_ERROR: 'LOAD_ERROR',
    LOAD_MORE_SUCCESS: 'LOAD_MORE_SUCCESS',
}

const reducer = (state, action) => {
    switch (action.type) {
        case TYPE.LOAD:
            return {
                ...state,
                status: STATUS.LOADING
            };
        case TYPE.LOAD_SUCCESS:
            return {
                status: STATUS.LOAD_SUCCESS,
                repos: action.payload.repos,
                user: action.payload.user
            }
        case TYPE.LOAD_ERROR:
            return {
                ...state,
                status: STATUS.LOAD_ERROR,
            }
        case TYPE.LOAD_MORE_SUCCESS:
            return {
                ...state,
                status: STATUS.LOAD_SUCCESS,
                repos: [...state.repos, ...action.payload],
            }
        default:
            return state;
    }
}

const useFetchDataHook = (username, getRepoList) => {

    const [state, dispatch] = useReducer(reducer, {
        status: STATUS.LOADING,
        user: null,
        repos: [],
    });
    const setData = useCallback(
        (user, repos) => dispatch({
            type: TYPE.LOAD_SUCCESS,
            payload:  {
                user,
                repos
            },
        }),
        [dispatch]
    );

    function getUser() {
        return state.user;
    }

    function getRepos() {
        return state.repos;
    }

    function isLoading() {
        return state.status === STATUS.LOADING;
    }

    function isLoadSuccess() {
        return state.status === STATUS.LOAD_SUCCESS;
    }

    function isLoadError() {
        return state.status === STATUS.LOAD_ERROR;
    }

    async function handleLoadMore() {
        try {
            const nextPage = Math.floor(state.repos.length / ITEM_PER_PAGE) + 1;
            dispatch({ type: TYPE.LOAD });
            const { data } = await getRepoList(username, nextPage);
            dispatch({
                type: TYPE.LOAD_MORE_SUCCESS,
                payload:  data,
            });
        } catch (error) {
            console.log(error);
            dispatch({ type: TYPE.LOAD_ERROR });
        }
    }

    return [
        getUser,
        getRepos,
        isLoading,
        setData,
        handleLoadMore,
        isLoadSuccess,
        isLoadError,
    ];
}

export default useFetchDataHook;
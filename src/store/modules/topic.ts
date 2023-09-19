/* 话题详情的 store */
import { defineStore } from 'pinia'
// 话题
import {
  getTopicByTidApi,
  TopicDetailResponseData,
  TopicAsideOtherTagRequestData,
  getRelatedTopicsByTagsApi,
  TopicAsideMasterRequestData,
  getPopularTopicsByUserUidApi,
  TopicAsideResponseData,
} from '@/api'
// 回复
import {
  getRepliesByPidApi,
  postReplyByPidApi,
  TopicReplyRequestData,
  TopicReplyResponseData,
  TopicCreateReplyRequestData,
  TopicCreateReplyResponseData,
} from '@/api'
// 评论
import {
  getCommentsByReplyRidApi,
  TopicCommentResponseData,
  postCommentByPidAndRidApi,
  TopicCreateCommentRequestData,
  TopicCreateCommentResponseData,
} from '@/api'

// 回复的缓存
interface ReplyDraft {
  /**
   * 编辑器相关
   * @param {number} editorHeight - 编辑器高度
   * @param {'' | 'essential' | 'minimal' | 'full'} mode - 编辑器 toolbar 模式
   * @param {'snow' | 'bubble'} theme - 编辑器主题
   */
  editorHeight: number
  textCount: number
  // 这里仅支持三种模式
  mode: '' | 'essential' | 'minimal'
  theme: 'snow' | 'bubble'
  // 是否显示热门关键词
  isShowHotKeywords: boolean

  // 当前话题的 id
  tid: number
  r_uid: number
  // 回复给谁，用于回复面板展示
  replyUserName: string
  to_uid: number
  content: string
  tags: string[]
  // 被回复的人的楼层数，用于跳转
  to_floor: number

  // 是否保存回复
  isSaveReply: boolean
  // 回复发布的状态，如果状态有变化则将发布好的回复数据添加在回复数组里
  // 这里与 true 和 false 无关，关心的是它的状态改变
  publishStatus: boolean
}

// 获取回复的请求
interface ReplyRequest {
  page: number
  limit: number
  sortField: string
  sortOrder: 'asc' | 'desc'
}

// 评论的缓存
interface CommentDraft {
  // 评论的内容
  tid: number
  rid: number
  c_uid: number
  to_uid: number
  content: string

  // 显示哪个评论的评论面板
  isShowCommentPanelRid: number
}

// 话题页面的 store
interface Topic {
  // 是否正在被编辑
  isEdit: boolean
  // 是否显示高级编辑模式
  isShowAdvance: boolean
  // 是否激活左侧交互面板
  isActiveAside: boolean
  // 是否滚动到顶部
  isScrollToTop: boolean
  // 加载完了是否还需要加载
  isLoading: boolean
  // 要滚动到的回复 id
  scrollToReplyId: number

  // 回复面板的宽度
  replyPanelWidth: number
  // 回复的缓存
  replyDraft: ReplyDraft
  // 获取回复的请求接口格式
  replyRequest: ReplyRequest

  // 评论的缓存
  commentDraft: CommentDraft
}

export const useKUNGalgameTopicStore = defineStore({
  id: 'topic',
  persist: true,
  state: (): Topic => ({
    isEdit: false,
    isShowAdvance: false,
    isActiveAside: false,
    isScrollToTop: false,
    isLoading: true,
    // 回复 id 从 0 开始，-1 只是为了监测数据变化，用于 watchEffect
    scrollToReplyId: -1,

    replyPanelWidth: 90,
    replyDraft: {
      editorHeight: 200,
      textCount: 0,
      mode: 'minimal',
      theme: 'snow',
      isShowHotKeywords: true,

      tid: 0,
      r_uid: 0,
      replyUserName: '',
      to_uid: 0,
      content: '',
      tags: [],
      to_floor: 0,

      isSaveReply: false,
      publishStatus: false,
    },
    replyRequest: {
      page: 1,
      limit: 5,
      sortField: 'floor',
      sortOrder: 'asc',
    },
    commentDraft: {
      tid: 0,
      rid: 0,
      c_uid: 0,
      to_uid: 0,
      content: '',

      isShowCommentPanelRid: 0,
    },
  }),
  actions: {
    // 左侧相同标签下的其它话题
    getRelatedTopicsByTags(
      request: TopicAsideOtherTagRequestData
    ): Promise<TopicAsideResponseData> {
      return new Promise((resolve, reject) => {
        getRelatedTopicsByTagsApi(request)
          .then((res) => {
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 楼主的其它话题
    getPopularTopicsByUserUid(
      request: TopicAsideMasterRequestData
    ): Promise<TopicAsideResponseData> {
      return new Promise((resolve, reject) => {
        getPopularTopicsByUserUidApi(request)
          .then((res) => {
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 获取单个话题
    getTopicByTid(tid: number): Promise<TopicDetailResponseData> {
      return new Promise((resolve, reject) => {
        getTopicByTidApi(tid)
          .then((res) => {
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 获取回复
    getReplies(tid: number): Promise<TopicReplyResponseData> {
      return new Promise((resolve, reject) => {
        // 这里的默认值用于初始化
        const requestData: TopicReplyRequestData = {
          tid: tid,
          page: this.replyRequest.page,
          limit: this.replyRequest.limit,
          sortField: this.replyRequest.sortField || 'floor',
          sortOrder: this.replyRequest.sortOrder || 'desc',
        }
        getRepliesByPidApi(requestData)
          .then((res) => {
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 创建回复
    postNewReply(): Promise<TopicCreateReplyResponseData> {
      return new Promise((resolve, reject) => {
        // 这里的值用于初始化回复
        const requestData: TopicCreateReplyRequestData = {
          tid: this.replyDraft.tid,
          r_uid: this.replyDraft.r_uid,
          to_uid: this.replyDraft.to_uid,
          to_floor: this.replyDraft.to_floor,
          tags: this.replyDraft.tags,
          content: this.replyDraft.content,
        }
        postReplyByPidApi(requestData)
          .then((res) => {
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 获取评论
    getComments(tid: number, rid: number): Promise<TopicCommentResponseData> {
      return new Promise((resolve, reject) => {
        getCommentsByReplyRidApi(tid, rid)
          .then((res) => {
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 创建一个评论
    postNewComment(): Promise<TopicCreateCommentResponseData> {
      return new Promise((resolve, reject) => {
        const requestData: TopicCreateCommentRequestData = {
          tid: this.commentDraft.tid,
          rid: this.commentDraft.rid,
          c_uid: this.commentDraft.c_uid,
          to_uid: this.commentDraft.to_uid,
          content: this.commentDraft.content,
        }
        postCommentByPidAndRidApi(requestData)
          .then((res) => {
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 设置回复草稿为原始值，用于回复发布按钮
    resetReplyDraft() {
      this.replyDraft.textCount = 0
      this.replyDraft.tid = 0
      this.replyDraft.r_uid = 0
      this.replyDraft.replyUserName = ''
      this.replyDraft.to_uid = 0
      this.replyDraft.content = ''
      this.replyDraft.tags = []

      this.replyDraft.isSaveReply = false
    },
    // 重置页数，是否加载，这样回复排序才能生效
    resetPageStatus() {
      this.replyRequest.page = 1
      this.isLoading = true
    },
    // 设置评论草稿为原始值，用于评论发布按钮
    resetCommentDraft() {
      this.commentDraft.tid = 0
      this.commentDraft.rid = 0
      this.commentDraft.c_uid = 0
      this.commentDraft.to_uid = 0
      this.commentDraft.content = ''

      this.commentDraft.isShowCommentPanelRid = 0
    },
  },
})

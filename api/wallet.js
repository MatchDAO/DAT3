import { request } from '@/config/request'
import { BASE_PATH } from '@/config/config'

/**
 * 钱包余额
 */
export function getWalletBalanceInfo(data = {}) {
  return request({
    method: 'POST',
    data,
    url: `${BASE_PATH}/wallet/balance`,
    showLoading: false,
  })
}

/**
 * 充值地址
 */
export function getDepositAddress(data = {}) {
  return request({
    method: 'POST',
    data,
    url: `${BASE_PATH}/wallet/getDepositAddress`,
    showLoading: false,
  })
}

/**
 * 固定手续费
 */
export function getChatFee() {
  return request({
    method: 'GET',
    url: `${BASE_PATH}/metadata/chatFee`,
    showLoading: true,
  })
}

/**
 * 代币价格(交易对)
 */
export function exchangePrice(data) {
  return request({
    method: 'POST',
    data,
    url: `${BASE_PATH}/wallet/exchangePrice`,
    showLoading: true,
  })
}

/**
 * 链信息 
 */
export function getChains() {
  return request({
    method: 'GET',
    url: `${BASE_PATH}/metadata/chains`,
    showLoading: true,
  })
}

/**
 * 提现
 */
export function withdraw(data) {
  return request({
    method: 'POST',
    data,
    url: `${BASE_PATH}/wallet/withdraw`,
    showLoading: true,
  })
}
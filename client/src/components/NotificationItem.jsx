// eslint-disable-next-line no-unused-vars
import React from 'react'

const NotificationItem = ({data}) => {
  return (
    <div className="notification-item">
      <h6>Title: {data?.task?.title}</h6>
      <p>Description: {data?.task?.description}</p>
      <p>Message: {data?.message}</p>
    </div>
  )
}

export default NotificationItem

import {Api} from "../api/api";
import {useEffect, useState} from "react";
import {Reminder, ReminderStatus} from "../model/reminder";
import {Button} from "react-bootstrap";
import {User} from "../model/user";
import {ReminderInputModal} from "./ReminderInputModal";
import {useNonNegNumberWithThousandSep} from "../hook/format";

const ReminderRow = function (props: { reminder: Reminder; }) {
  const reminder = props.reminder;
  const amountStr = useNonNegNumberWithThousandSep(reminder.amount)[1];
  const statusToBootstrapStyle = function (status: ReminderStatus) {
    switch (status) {
      case ReminderStatus.PENDING:
        return "warning";
      case ReminderStatus.CLOSED:
        return "secondary";
      case ReminderStatus.FINISHED:
        return "success";
    }
    return "primary";
  }
  const statusToDisplayString = function (status: ReminderStatus) {
    switch (status) {
      case ReminderStatus.PENDING:
        return "Pending";
      case ReminderStatus.CLOSED:
        return "Closed";
      case ReminderStatus.FINISHED:
        return "Finished";
    }
    return "Unknown";
  }
  return <tr>
    <td><i className="fab fa-angular fa-lg text-danger me-1"></i> <strong>{reminder.id}</strong></td>
    <td>{reminder.description}</td>
    <td>
      <ul className="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
        {reminder.users.map(u =>
          <li
            data-bs-toggle="tooltip"
            data-popup="tooltip-custom"
            data-bs-placement="top"
            className="avatar avatar-xs pull-up"
            key={u.id}
            title={u.name}
          >
            <img src={u.avatarUrl} alt={u.id} className="rounded-circle"/>
          </li>
        )}
      </ul>
    </td>
    <td>{amountStr}</td>
    <td><i className='bx bx-image'></i></td>
    <td><span
      className={`badge bg-label-${statusToBootstrapStyle(reminder.status)} me-1`}>{statusToDisplayString(reminder.status)}</span>
    </td>
    <td>
      <div className="dropdown">
        <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
          <i className="bx bx-dots-vertical-rounded"></i>
        </button>
        <div className="dropdown-menu">
          <a className="dropdown-item" href="index.html"
          ><i className="bx bx-edit-alt me-1"></i> Edit</a
          >
          <a className="dropdown-item" href="index.html"
          ><i className="bx bx-trash me-1"></i> Delete</a
          >
        </div>
      </div>
    </td>
  </tr>;
}

export const DashboardPage = function (props: { api: Api; }) {
  const api = props.api;
  const [users, setUsers] = useState(new Array<User>())
  const [reminders, setReminders] = useState(new Array<Reminder>());

  const fetchUsers = async function () {
    const response = await api.getAllUsers()
    if (response.ok()) {
      setUsers(response.content!);
    }
  }
  useEffect(() => {
    fetchUsers();
  });

  const fetchReminders = async function () {
    const response = await api.getAllReminders()
    if (response.ok()) {
      setReminders(response.content!);
    }
  }
  useEffect(() => {
    fetchReminders();
  });

  const createReminder = async function (description: string, userIds: Array<string>, amount: number) {
    const response = await api.createReminder(description, userIds, amount);
    if (response.ok()) {
      const createdReminder = response.content!;
      setReminders(prev => [createdReminder, ...prev]);
    }
  }

  return <div className="container-xxl flex-grow-1 container-p-y">
    <h4 className="fw-bold py-3 mb-2">Reminders</h4>

    <Button
      type="button"
      className="btn btn-primary mb-4 "
      data-bs-toggle="modal"
      data-bs-target="#reminderInput"
    >Create</Button>

    <ReminderInputModal id="reminderInput" users={users} onSubmit={createReminder}/>

    <div className="card">
      <h5 className="card-header">Title</h5>
      <div className="table-responsive text-nowrap">
        <table className="table">
          <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Users</th>
            <th>Amount</th>
            <th>Attachment</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody className="table-border-bottom-0">
          {reminders.map(r => <ReminderRow key={r.id} reminder={r}/>)}
          </tbody>
        </table>
      </div>
    </div>
  </div>;
}

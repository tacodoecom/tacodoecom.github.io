import {useMemo, useRef, useState} from "react";
import {User} from "../model/user";
import {useNonNegNumberWithThousandSep} from "../hook/format";
import {toast} from "react-toastify";
import {defaultToastOption} from "./common";

export const UserCheckbox = function (props: { user: User, onChange: (newValue: boolean) => void; }) {
  const user = props.user;
  const onChange = props.onChange;
  const [checked, setChecked] = useState(false);
  const btnStyle = useMemo(() => {
    if (checked) {
      return "btn btn-primary";
    } else {
      return "btn btn-outline-primary";
    }
  }, [checked]);

  return <li className="my-3 align-middle">
    <input type="checkbox" id={`checkbox-${user.id}`} autoComplete="off" hidden={true}
           checked={checked}
           onChange={e => {
             const checked = e.target.checked;
             onChange(checked);
             setChecked(checked);
           }}/>
    <label className={btnStyle}
           htmlFor={`checkbox-${user.id}`}
           onMouseEnter={e => e.preventDefault()}
           onMouseDown={e => e.preventDefault()} // prevent the button from being focused after clicking to allow bootstrap outlined style to be applied
    >
      <img src={user.avatarUrl} alt={user.id} className="avatar-sm rounded-circle me-2"/>
      {user.name}
    </label>
  </li>
}

const groupUsersByTag = function (users: Array<User>): Array<{ tag: string, users: Array<User> }> {
  const groupByTag = new Map<string, Array<User>>();
  const defaultTag = "other";
  for (const user of users) {
    const tag = user.tag || defaultTag;
    if (!groupByTag.has(tag)) {
      groupByTag.set(tag, new Array<User>());
    }
    groupByTag.get(tag)!.push(user);
  }
  const groups: Array<{ tag: string, users: Array<User> }> = [];
  groupByTag.forEach((v, k) => {
    groups.push({tag: k, users: v});
  });
  const compare = function (a: string, b: string): number {
    if (a < b) {
      return -1;
    } else if (a > b) {
      return 1;
    }
    return 0
  }

  groups.sort((a, b) => compare(a.tag, b.tag));
  groups.forEach(group => group.users.sort((a, b) => compare(a.name, b.name)));
  return groups;
}

export const ReminderInputModal = function (props: { id: string; users: Array<User>, onSubmit: (description: string, userIds: Array<string>, amount: number) => void; }) {
  const [description, setDescription] = useState("");
  const [userIds, setUserIds] = useState(new Array<string>());
  const [amount, amountStr, setAmount] = useNonNegNumberWithThousandSep(0);
  const closeRef = useRef<HTMLButtonElement>(null);

  const handleUserCheckboxChanged = function (userId: string, checked: boolean) {
    const newUserList = userIds.filter(id => id !== userId);
    if (checked) {
      newUserList.push(userId);
    }
    setUserIds(newUserList);
  }

  const groups = groupUsersByTag(props.users);

  const validateInput = function (): boolean {
    return description !== "" && userIds.length > 0 && amount > 0;
  }

  return <div className="modal fade" id={props.id} tabIndex={-1} aria-hidden="true">
    <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="modalCenterTitle">Create a reminder</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body">
          <div className="row">
            <div className="col mb-3">
              <label htmlFor="descriptionWithTitle" className="form-label">Description</label>
              <input
                type="text"
                id="descriptionWithTitle"
                className="form-control"
                placeholder="Enter description"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="col mb-3">
              <label htmlFor="amountWithTitle" className="form-label">Amount</label>
              <input
                type="text"
                id="amountWithTitle"
                className="form-control"
                placeholder="Enter amount"
                value={amountStr}
                onChange={e => {
                  setAmount(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="row">
            {groups.map(p => {
              const tag = p.tag;
              const users = p.users;
              return <div key={tag} className="col mb-3">
                <h4>{tag}</h4>
                <ul className="list-unstyled">
                  {users.map(u =>
                    <UserCheckbox key={`user-checkbox-${u.id}`}
                                  user={u}
                                  onChange={(checked) => handleUserCheckboxChanged(u.id, checked)}/>
                  )}
                </ul>
              </div>;
            })}
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary"
                  onClick={e => {
                    if (validateInput()) {
                      props.onSubmit(description, userIds, amount);
                      closeRef.current!.click();
                      toast.success("Reminder successfully created", defaultToastOption);
                    } else {
                      toast.error("Invalid input, make sure to fill in description, amount (> 0) and choose at least 1 user", defaultToastOption);
                    }
                  }}>Submit
          </button>
          <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal" ref={closeRef}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
}

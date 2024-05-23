const users = [
    {
        name: 'peplol',
        password: "df*(f9fdfdfdf",
        id: 1,
    },
    {
        name: 'shhi',
        password: "HIUhuoyiLMK78oh",
        id: 1,
    },
    {
        name: 'mykola',
        password: "123",
        id: 1,
    },
    
]

export function UsersList() {
    return (
        <>
        <h1>Users List</h1>     
        {
            users.map((user) => {
                 return (
                <div key={user.id}>
                    <h2>Zhieny</h2>
                    <p>{user.name}</p>
                    <p>{user.password}</p>
                </div>
                    )
                })
            }
        </>
    )
}

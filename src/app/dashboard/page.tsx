import { requireUser } from "@/app/lib/hooks"

const Dashboard = async () => {

    const session = await requireUser()
    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    )
}

export default Dashboard

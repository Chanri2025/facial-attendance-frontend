import {useState} from "react";
import {ArrowLeft, Calendar as CalendarIcon, Users, TrendingUp, Clock} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {Card} from "@/components/ui/card.tsx";
import {Calendar} from "@/components/ui/calendar.tsx";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover.tsx";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.tsx";
import {format} from "date-fns";
import {cn} from "@/lib/utils.ts";

interface DashboardProps {
    onBack: () => void;
}

const Dashboard = ({onBack}: DashboardProps) => {
    const [date, setDate] = useState<Date>(new Date());

    const stats = [
        {label: "Present Today", value: "42", icon: Users, gradient: "from-emerald-500 to-teal-500"},
        {label: "Total Employees", value: "50", icon: Users, gradient: "from-blue-500 to-indigo-500"},
        {label: "Attendance Rate", value: "84%", icon: TrendingUp, gradient: "from-purple-500 to-pink-500"},
        {label: "Avg Check-in", value: "9:15 AM", icon: Clock, gradient: "from-orange-500 to-amber-500"},
    ];

    const recentAttendance = [
        {id: 1, name: "John Doe", empId: "EMP001", time: "09:05 AM", status: "Present"},
        {id: 2, name: "Jane Smith", empId: "EMP002", time: "09:12 AM", status: "Present"},
        {id: 3, name: "Mike Johnson", empId: "EMP003", time: "09:18 AM", status: "Present"},
        {id: 4, name: "Sarah Williams", empId: "EMP004", time: "09:25 AM", status: "Present"},
        {id: 5, name: "Tom Brown", empId: "EMP005", time: "10:05 AM", status: "Late"},
    ];

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2"/>
                    Back
                </Button>

                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-card-foreground mb-2">Attendance Dashboard</h1>
                        <p className="text-muted-foreground flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4"/>
                            {date.toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                            })}
                        </p>
                    </div>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-[240px] justify-start text-left font-normal"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4"/>
                                {format(date, "PPP")}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(newDate) => newDate && setDate(newDate)}
                                initialFocus
                                className="pointer-events-auto"
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <Card key={index} className={`p-6 bg-gradient-to-br ${stat.gradient} border-0`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-white/90 mb-1">{stat.label}</p>
                                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                                </div>
                                <div
                                    className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                    <stat.icon className="w-6 h-6 text-white"/>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4 text-card-foreground">Today's Attendance</h2>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Employee ID</TableHead>
                                    <TableHead>Check-in Time</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentAttendance.map((record) => (
                                    <TableRow key={record.id}>
                                        <TableCell className="font-bold">{record.name}</TableCell>
                                        <TableCell className="font-bold">{record.empId}</TableCell>
                                        <TableCell className="font-bold">{record.time}</TableCell>
                                        <TableCell>
                      <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              record.status === "Present"
                                  ? "bg-success/10 text-success"
                                  : "bg-destructive/10 text-destructive"
                          }`}
                      >
                        {record.status}
                      </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;

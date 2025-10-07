import { ArrowLeft, Calendar, Users, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DashboardProps {
  onBack: () => void;
}

const Dashboard = ({ onBack }: DashboardProps) => {
  const stats = [
    { label: "Present Today", value: "42", icon: Users, color: "text-success" },
    { label: "Total Employees", value: "50", icon: Users, color: "text-primary" },
    { label: "Attendance Rate", value: "84%", icon: TrendingUp, color: "text-accent" },
    { label: "Avg Check-in", value: "9:15 AM", icon: Clock, color: "text-primary" },
  ];

  const recentAttendance = [
    { id: 1, name: "John Doe", empId: "EMP001", time: "09:05 AM", status: "Present" },
    { id: 2, name: "Jane Smith", empId: "EMP002", time: "09:12 AM", status: "Present" },
    { id: 3, name: "Mike Johnson", empId: "EMP003", time: "09:18 AM", status: "Present" },
    { id: 4, name: "Sarah Williams", empId: "EMP004", time: "09:25 AM", status: "Present" },
    { id: 5, name: "Tom Brown", empId: "EMP005", time: "10:05 AM", status: "Late" },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-card-foreground mb-2">Attendance Dashboard</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {new Date().toLocaleDateString("en-US", { 
              weekday: "long", 
              year: "numeric", 
              month: "long", 
              day: "numeric" 
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-card-foreground">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
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
                    <TableCell className="font-medium">{record.name}</TableCell>
                    <TableCell>{record.empId}</TableCell>
                    <TableCell>{record.time}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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

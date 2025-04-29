
import React, { useState, useEffect } from 'react';
import { Server, CheckCheck } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { backendMachines, getSelectedMachine, setSelectedMachine, BackendMachine } from '@/utils/apiService';
import { toast } from 'sonner';

interface BackendSelectorProps {
  onMachineChange?: (machine: BackendMachine) => void;
  className?: string;
}

const BackendSelector = ({ onMachineChange, className = '' }: BackendSelectorProps) => {
  const [selectedMachine, setMachine] = useState<BackendMachine>(() => getSelectedMachine());

  // Handle machine change
  const handleChange = (value: string) => {
    const machine = backendMachines.find(m => m.name === value);
    if (machine) {
      setMachine(machine);
      setSelectedMachine(machine);
      
      toast.success(`Switched to ${machine.name}`, {
        description: `Using backend at ${machine.url}`,
        icon: <CheckCheck className="h-4 w-4" />
      });
      
      if (onMachineChange) {
        onMachineChange(machine);
      }

      // Force page refresh to apply changes across the app
      // This is a simple way to ensure all components use the new backend
      window.location.reload();
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Server className="h-4 w-4 text-muted-foreground" />
      <Select value={selectedMachine.name} onValueChange={handleChange}>
        <SelectTrigger className="w-[130px] h-9">
          <SelectValue placeholder="Select machine" />
        </SelectTrigger>
        <SelectContent>
          {backendMachines.map((machine) => (
            <SelectItem key={machine.name} value={machine.name}>
              {machine.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BackendSelector;

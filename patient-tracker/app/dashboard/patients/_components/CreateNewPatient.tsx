import React, { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface CreatePatientFormProps {
    onClose: () => void;        // Callback function to close the form
    onPatientAdded: () => void; // Callback function to update parent component's state
}

const CreatePatientForm: React.FC<CreatePatientFormProps> = ({ onClose, onPatientAdded }) => {
  const [newPatientName, setNewPatientName] = useState("");
  const [newPatientGender, setNewPatientGender] = useState("");
  const [newPatientAge, setNewPatientAge] = useState("");
  const [newPatientPhone, setNewPatientPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddPatient = async () => {
    if (!newPatientName.trim()) return toast.error("Patient name is required!");

    setLoading(true);
    try {
      const response = await fetch(
        `http://${window.location.hostname}:${
          process.env.NEXT_PUBLIC_API_PORT || 3000
        }/api/data/create-patient`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: newPatientName,
          age: newPatientAge,
          gender: newPatientGender,
          phone_number: newPatientPhone,
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      toast.success("Patient added successfully!");
      onPatientAdded(); // Update parent component's state

      // Clear the input fields
      setNewPatientName("");
      setNewPatientGender("");
      setNewPatientAge("");
      setNewPatientPhone("");
    } catch (error: any) {
      toast.error("An has error occurred: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3 p-2 border rounded-md bg-gray-100">
      <Label>New Patient Info</Label>
      <div className="py-1 mt-2">
        <Input
          type="text"
          placeholder="Enter patient name"
          onChange={(e) => setNewPatientName(e.target.value)}
        />
      </div>
      <div className="py-1">
        <Input
          type="text"
          placeholder="Enter patient gender"
          onChange={(e) => setNewPatientGender(e.target.value)}
        />
      </div>
      <div className="py-1">
        <Input
          type="text"
          placeholder="Enter patient age"
          onChange={(e) => setNewPatientAge(e.target.value)}
        />
      </div>
      <div className="py-1">
        <Input
          type="text"
          placeholder="Enter patient phone number"
          onChange={(e) => setNewPatientPhone(e.target.value)}
        />
      </div>
      <div className="py-3 mt-2 flex justify-between">
        <Button onClick={onClose} variant="link">
          Cancel
        </Button>
        <Button
          onClick={handleAddPatient}
          disabled={loading}
          variant="ghost"
        >
          {loading ? "Adding..." : "Add"}
        </Button>
      </div>
    </div>
  );
};

export default CreatePatientForm;

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, isBefore, parseISO, setHours, setMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, X } from "lucide-react";
import * as React from "react";
import { Input } from "./input";

interface DateTimePickerProps
    extends Omit<React.ComponentProps<"button">, "onChange"> {
    value?: string;
    onChange: (dateString: string) => void;
    placeholder?: string;
    disablePastDates?: boolean;
}

export function DateTimePicker({
    value,
    onChange,
    placeholder = "Selecione data e hora",
    disablePastDates = false,
    className,
    ...props
}: DateTimePickerProps) {
    const [open, setOpen] = React.useState(false);
    const date = value ? parseISO(value) : undefined;
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
        date,
    );
    const [tempDate, setTempDate] = React.useState<Date | undefined>(date);
    const [hours, setHoursState] = React.useState(
        value ? parseISO(value).getHours() : 0,
    );
    const [minutes, setMinutesState] = React.useState(
        value ? parseISO(value).getMinutes() : 0,
    );

    React.useEffect(() => {
        const newDate = value ? parseISO(value) : undefined;
        setSelectedDate(newDate);
        setTempDate(newDate);
        setHoursState(value ? parseISO(value).getHours() : 0);
        setMinutesState(value ? parseISO(value).getMinutes() : 0);
    }, [value]);

    const handleDateChange = (newDate?: Date) => {
        if (newDate) {
            setTempDate(newDate);
        }
    };

    const handleConfirm = () => {
        if (tempDate) {
            const withTime = setMinutes(setHours(tempDate, hours), minutes);

            if (disablePastDates && isBefore(withTime, new Date())) {
                return;
            }

            onChange(withTime.toISOString());
            setSelectedDate(tempDate);
            setOpen(false);
        }
    };

    const handleClear = () => {
        onChange("");
        setSelectedDate(undefined);
        setTempDate(undefined);
        setHoursState(0);
        setMinutesState(0);
        setOpen(false);
    };

    const handleCancel = () => {
        setTempDate(selectedDate);
        setHoursState(selectedDate ? selectedDate.getHours() : 0);
        setMinutesState(selectedDate ? selectedDate.getMinutes() : 0);
        setOpen(false);
    };

    const isTimeInPast = React.useMemo(() => {
        if (!disablePastDates || !tempDate) return false;
        const withTime = setMinutes(setHours(tempDate, hours), minutes);
        return isBefore(withTime, new Date());
    }, [disablePastDates, tempDate, hours, minutes]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    className={cn(
                        "border-input flex h-9 w-full min-w-0 items-center rounded-md border bg-transparent px-3 py-1 text-base transition-colors outline-none",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none",
                        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                        "cursor-pointer justify-start text-left text-sm font-normal",
                        !selectedDate && "text-muted-foreground",
                        className,
                    )}
                    type="button"
                    {...props}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span className="flex-1 truncate">
                        {selectedDate
                            ? format(
                                  setMinutes(
                                      setHours(selectedDate, hours),
                                      minutes,
                                  ),
                                  "dd/MM/yyyy HH:mm",
                                  { locale: ptBR },
                              )
                            : placeholder}
                    </span>
                    {selectedDate && (
                        <X
                            className="ml-auto h-4 w-4 opacity-50 hover:opacity-100"
                            onClick={e => {
                                e.stopPropagation();
                                handleClear();
                            }}
                        />
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={tempDate}
                    onSelect={handleDateChange}
                    disabled={
                        disablePastDates ? { before: new Date() } : undefined
                    }
                    autoFocus={false}
                    locale={ptBR}
                />
                <div className="dark:border-border flex items-center justify-center gap-2 border-t-2 border-black/10 p-2">
                    <label className="text-sm font-medium">Hora:</label>
                    <Input
                        type="text"
                        inputMode="numeric"
                        value={hours.toString().padStart(2, "0")}
                        onChange={e => {
                            const value = e.target.value.replace(/\D/g, "");
                            const num = Number(value);
                            if (!isNaN(num)) {
                                setHoursState(Math.min(num, 23));
                            }
                        }}
                        className="h-8 w-12 px-2 text-center"
                        placeholder="HH"
                    />
                    <span className="text-lg font-medium">:</span>
                    <Input
                        type="text"
                        inputMode="numeric"
                        value={minutes.toString().padStart(2, "0")}
                        onChange={e => {
                            const value = e.target.value.replace(/\D/g, "");
                            const num = Number(value);
                            if (!isNaN(num)) {
                                setMinutesState(Math.min(num, 59));
                            }
                        }}
                        className="h-8 w-12 px-2 text-center"
                        placeholder="MM"
                    />
                </div>

                {isTimeInPast && (
                    <div className="px-3 pb-2">
                        <p className="text-xs text-red-600">
                            Não é possível selecionar horário passado
                        </p>
                    </div>
                )}

                <div className="dark:border-border flex items-center justify-between gap-2 border-t-2 border-black/10 p-3">
                    <Button
                        variant="outline"
                        size="xs"
                        onClick={handleClear}
                        disabled={!tempDate}
                        type="button"
                    >
                        Limpar
                    </Button>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="xs"
                            onClick={handleCancel}
                            type="button"
                        >
                            Cancelar
                        </Button>
                        <Button
                            size="xs"
                            onClick={handleConfirm}
                            disabled={!tempDate || isTimeInPast}
                            type="button"
                        >
                            Confirmar
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

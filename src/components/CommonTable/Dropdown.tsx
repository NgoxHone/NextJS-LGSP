import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { DropdownOption } from './types';

interface DropdownProps {
  options: DropdownOption[];
  value: any;
  onChange: (value: any) => void;
  renderOption?: (option: DropdownOption) => React.ReactNode;
  className?: string;
}

export default function Dropdown({ options, value, onChange, renderOption, className }: DropdownProps) {
  const selected = options.find(opt => opt.value === value) || options[0];
  return (
    <Listbox value={value} onChange={onChange}>
      <div className={`relative w-auto min-w-[160px] ${className || ''}`}>
        <Listbox.Button className="relative w-full cursor-pointer rounded border bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm">
          <span className="block truncate">{selected ? (renderOption ? renderOption(selected) : selected.label) : ''}</span>
        </Listbox.Button>
        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full min-w-[160px] overflow-auto rounded bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {options.map((option) => (
              <Listbox.Option
                key={option.value}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'}`
                }
                value={option.value}
              >
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                      {renderOption ? renderOption(option) : option.label}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">✓</span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
} 
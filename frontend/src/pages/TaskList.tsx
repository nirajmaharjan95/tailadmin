import CustomBreadcrumb from "@/components/CustomBreadcrumb";
import { Calendar, Check, Ellipsis, GripVertical, Plus } from "lucide-react";

const TaskList = () => {
  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              Task List
            </h2>

            <CustomBreadcrumb />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex flex-col items-center px-4 py-5 xl:px-6 xl:py-6">
            <div className="flex flex-col w-full gap-5 sm:justify-between xl:flex-row xl:items-center">
              <div className="flex flex-wrap items-center gap-x-1 gap-y-2 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
                <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md h group hover:text-gray-900 dark:hover:text-white text-gray-900 dark:text-white bg-white dark:bg-gray-800">
                  All Tasks
                  <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium leading-normal group-hover:bg-brand-50 group-hover:text-brand-500 dark:group-hover:bg-brand-500/15 dark:group-hover:text-brand-400 text-brand-500 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/15">
                    11
                  </span>
                </button>

                <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md group hover:text-gray-900 dark:hover:text-white text-gray-500 dark:text-gray-400">
                  To do
                  <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium leading-normal group-hover:bg-brand-50 group-hover:text-brand-500 dark:group-hover:bg-brand-500/15 dark:group-hover:text-brand-400 bg-white dark:bg-white/[0.03]">
                    3
                  </span>
                </button>

                <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md group hover:text-gray-900 dark:hover:text-white text-gray-500 dark:text-gray-400">
                  In Progress
                  <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium leading-normal group-hover:bg-brand-50 group-hover:text-brand-500 dark:group-hover:bg-brand-500/15 dark:group-hover:text-brand-400 bg-white dark:bg-white/[0.03]">
                    4
                  </span>
                </button>

                <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md group hover:text-gray-900 dark:hover:text-white text-gray-500 dark:text-gray-400">
                  Completed
                  <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium leading-normal group-hover:bg-brand-50 group-hover:text-brand-500 dark:group-hover:bg-brand-500/15 dark:group-hover:text-brand-400 bg-white dark:bg-white/[0.03]">
                    4
                  </span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3 xl:justify-end">
                <button className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600">
                  Add New Task
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-8 border-t border-gray-200 mt-7 dark:border-gray-800 sm:mt-0 xl:p-6">
            <div className="flex flex-col gap-4 swim-lane">
              <div className="flex items-center justify-between mb-2">
                <h3 className="flex items-center gap-3 text-base font-medium text-gray-800 dark:text-white/90">
                  To Do
                  <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-theme-xs font-medium text-gray-700 dark:bg-white/[0.03] dark:text-white/80">
                    3
                  </span>
                </h3>

                <div className="relative">
                  <button className="text-gray-700 dark:text-gray-400">
                    <Ellipsis size={16} />
                  </button>
                  <div
                    className="absolute right-0 top-full z-40 w-[140px] space-y-1 rounded-2xl border border-gray-200 bg-white p-2 shadow-theme-md dark:border-gray-800 dark:bg-gray-dark"
                    style={{ display: "none" }}
                  >
                    <button className="flex w-full px-3 py-2 font-medium text-left text-gray-500 rounded-lg text-theme-xs hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                      Edit
                    </button>
                    <button className="flex w-full px-3 py-2 font-medium text-left text-gray-500 rounded-lg text-theme-xs hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                      Delete
                    </button>
                    <button className="flex w-full px-3 py-2 font-medium text-left text-gray-500 rounded-lg text-theme-xs hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                      Clear All
                    </button>
                  </div>
                </div>
              </div>

              <div
                draggable="true"
                className="p-5 bg-white border border-gray-200 task rounded-xl shadow-theme-sm dark:border-gray-800 dark:bg-white/5"
              >
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex items-start w-full gap-4">
                    <span className="text-gray-400">
                      <GripVertical />
                    </span>

                    <label
                      htmlFor="taskCheckbox2"
                      className="w-full cursor-pointer"
                    >
                      <div className="relative flex items-start">
                        <input
                          type="checkbox"
                          id="taskCheckbox2"
                          className="sr-only taskCheckbox"
                        />
                        <div className="flex items-center justify-center w-full h-5 mr-3 border border-gray-300 rounded-md box max-w-5 dark:border-gray-700">
                          <span className="opacity-0">
                            <Check size={14} />
                          </span>
                        </div>
                        <p className="-mt-0.5 text-base text-gray-800 dark:text-white/90">
                          Solve the Dribbble prioritisation issue with the team
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="flex flex-col-reverse items-start justify-end w-full gap-3 xl:flex-row xl:items-center xl:gap-5">
                    <div className="flex items-center justify-between w-full gap-5 xl:w-auto xl:justify-normal">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-sm text-gray-500 cursor-pointer dark:text-gray-400">
                          <Calendar size={14} />
                          Jan 8, 2027
                        </span>
                      </div>

                      <div className="h-6 w-full max-w-6 overflow-hidden rounded-full border-[0.5px] border-gray-200 dark:border-gray-800">
                        <img src="src/images/user/user-13.jpg" alt="user" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 swim-lane">
              <div className="flex items-center justify-between mb-2">
                <h3 className="flex items-center gap-3 text-base font-medium text-gray-800 dark:text-white/90">
                  In Progress
                  <span className="inline-flex rounded-full bg-warning-50 px-2 py-0.5 text-theme-xs font-medium text-warning-700 dark:bg-warning-500/15 dark:text-orange-400">
                    4
                  </span>
                </h3>

                <div className="relative">
                  <button className="text-gray-700 dark:text-gray-400">
                    <Ellipsis size={16} />
                  </button>
                  <div
                    className="absolute right-0 top-full z-40 w-[140px] space-y-1 rounded-2xl border border-gray-200 bg-white p-2 shadow-theme-md dark:border-gray-800 dark:bg-gray-dark"
                    style={{ display: "none" }}
                  >
                    <button className="flex w-full px-3 py-2 font-medium text-left text-gray-500 rounded-lg text-theme-xs hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                      Edit
                    </button>
                    <button className="flex w-full px-3 py-2 font-medium text-left text-gray-500 rounded-lg text-theme-xs hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                      Delete
                    </button>
                    <button className="flex w-full px-3 py-2 font-medium text-left text-gray-500 rounded-lg text-theme-xs hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                      Clear All
                    </button>
                  </div>
                </div>
              </div>

              <div
                draggable="true"
                className="p-5 bg-white border border-gray-200 task rounded-xl shadow-theme-sm dark:border-gray-800 dark:bg-white/5"
              >
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex items-start w-full gap-4">
                    <span className="text-gray-400">
                      <GripVertical />
                    </span>

                    <label
                      htmlFor="taskCheckbox2"
                      className="w-full cursor-pointer"
                    >
                      <div className="relative flex items-start">
                        <input
                          type="checkbox"
                          id="taskCheckbox2"
                          className="sr-only taskCheckbox"
                        />
                        <div className="flex items-center justify-center w-full h-5 mr-3 border border-gray-300 rounded-md box max-w-5 dark:border-gray-700">
                          <span className="opacity-0">
                            <Check size={14} />
                          </span>
                        </div>
                        <p className="-mt-0.5 text-base text-gray-800 dark:text-white/90">
                          Solve the Dribbble prioritisation issue with the team
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="flex flex-col-reverse items-start justify-end w-full gap-3 xl:flex-row xl:items-center xl:gap-5">
                    <div className="flex items-center justify-between w-full gap-5 xl:w-auto xl:justify-normal">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-sm text-gray-500 cursor-pointer dark:text-gray-400">
                          <Calendar size={14} />
                          Jan 8, 2027
                        </span>
                      </div>

                      <div className="h-6 w-full max-w-6 overflow-hidden rounded-full border-[0.5px] border-gray-200 dark:border-gray-800">
                        <img src="src/images/user/user-13.jpg" alt="user" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 swim-lane">
              <div className="flex items-center justify-between mb-2">
                <h3 className="flex items-center gap-3 text-base font-medium text-gray-800 dark:text-white/90">
                  Completed
                  <span className="inline-flex rounded-full bg-success-50 px-2 py-0.5 text-theme-xs font-medium text-success-700 dark:bg-success-500/15 dark:text-success-500">
                    4
                  </span>
                </h3>

                <div className="relative">
                  <button className="text-gray-700 dark:text-gray-400">
                    <Ellipsis size={16} />
                  </button>
                  <div
                    className="absolute right-0 top-full z-40 w-[140px] space-y-1 rounded-2xl border border-gray-200 bg-white p-2 shadow-theme-md dark:border-gray-800 dark:bg-gray-dark"
                    style={{ display: "none" }}
                  >
                    <button className="flex w-full px-3 py-2 font-medium text-left text-gray-500 rounded-lg text-theme-xs hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                      Edit
                    </button>
                    <button className="flex w-full px-3 py-2 font-medium text-left text-gray-500 rounded-lg text-theme-xs hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                      Delete
                    </button>
                    <button className="flex w-full px-3 py-2 font-medium text-left text-gray-500 rounded-lg text-theme-xs hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                      Clear All
                    </button>
                  </div>
                </div>
              </div>

              <div
                draggable="true"
                className="p-5 bg-white border border-gray-200 task rounded-xl shadow-theme-sm dark:border-gray-800 dark:bg-white/5"
              >
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex items-start w-full gap-4">
                    <span className="text-gray-400">
                      <GripVertical />
                    </span>

                    <label
                      htmlFor="taskCheckbox2"
                      className="w-full cursor-pointer"
                    >
                      <div className="relative flex items-start">
                        <input
                          type="checkbox"
                          id="taskCheckbox2"
                          className="sr-only taskCheckbox"
                        />
                        <div className="flex items-center justify-center w-full h-5 mr-3 border border-gray-300 rounded-md box max-w-5 dark:border-gray-700">
                          <span className="opacity-0">
                            <Check size={14} />
                          </span>
                        </div>
                        <p className="-mt-0.5 text-base text-gray-800 dark:text-white/90">
                          Solve the Dribbble prioritisation issue with the team
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="flex flex-col-reverse items-start justify-end w-full gap-3 xl:flex-row xl:items-center xl:gap-5">
                    <span className="inline-flex rounded-full bg-success-50 px-2 py-0.5 text-theme-xs font-medium text-success-700 dark:bg-success-500/15 dark:text-success-500">
                      Template
                    </span>
                    <div className="flex items-center justify-between w-full gap-5 xl:w-auto xl:justify-normal">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-sm text-gray-500 cursor-pointer dark:text-gray-400">
                          <Calendar size={14} />
                          Jan 8, 2027
                        </span>
                      </div>

                      <div className="h-6 w-full max-w-6 overflow-hidden rounded-full border-[0.5px] border-gray-200 dark:border-gray-800">
                        <img src="src/images/user/user-13.jpg" alt="user" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskList;

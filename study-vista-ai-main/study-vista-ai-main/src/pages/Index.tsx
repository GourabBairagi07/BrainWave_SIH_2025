import { useState, useRef, useEffect } from "react";
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Award, 
  TrendingUp, 
  Bell, 
  Search, 
  User, 
  Settings,
  Bot,
  MessageCircle,
  Play,
  FileText,
  Target,
  Star,
  Moon,
  Sun,
  HelpCircle,
  Mail,
  X,
  ChevronDown,
  Home,
  ClipboardCheck,
  ChevronRight,
  Code,
  Palette,
  Database,
  Smartphone,
  Globe,
  Brain,
  Heart,
  Trophy,
  LogOut,
  GraduationCap,
  Calculator,
  FlaskConical,
  Atom,
  History,
  Languages,
  Music,
  Paintbrush,
  Camera,
  Gamepad2,
  Briefcase,
  LineChart,
  Shield,
  Stethoscope,
  Wrench,
  Cpu,
  Zap,
  Coins,
  Menu,
  Users,
  Map,
  School,
  Lightbulb,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send
} from "lucide-react";

export default function EduAIStudentDashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [chatVisible, setChatVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [kudosCount, setKudosCount] = useState(0);
  const [selectedClass, setSelectedClass] = useState('');
  const [showClassSelector, setShowClassSelector] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAllCourses, setShowAllCourses] = useState(false);
  
  // Voice Assistant States
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your AI study assistant. How can I help you today?' }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [elevenlabsApiKey, setElevenlabsApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  // Initialize speech synthesis and recognition
  useEffect(() => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setCurrentMessage(transcript);
        handleSendMessage(transcript);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
    
    // Load API key from localStorage
    const savedApiKey = localStorage.getItem('elevenlabs_api_key');
    if (savedApiKey) {
      setElevenlabsApiKey(savedApiKey);
    }
  }, []);

  // Voice Assistant Functions
  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const speakText = async (text) => {
    if (elevenlabsApiKey) {
      try {
        setIsSpeaking(true);
        const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/9BWtsMINqrJLrRacOk9x', {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': elevenlabsApiKey
          },
          body: JSON.stringify({
            text: text,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.5
            }
          })
        });

        if (response.ok) {
          const audioBlob = await response.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          
          audio.onended = () => {
            setIsSpeaking(false);
            URL.revokeObjectURL(audioUrl);
          };
          
          await audio.play();
        } else {
          throw new Error('ElevenLabs API request failed');
        }
      } catch (error) {
        console.error('Text-to-speech error:', error);
        setIsSpeaking(false);
        // Fallback to browser TTS
        fallbackSpeak(text);
      }
    } else {
      fallbackSpeak(text);
    }
  };

  const fallbackSpeak = (text) => {
    if (synthRef.current) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      synthRef.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsSpeaking(false);
  };

  const handleSendMessage = async (messageText = currentMessage) => {
    if (!messageText.trim()) return;

    const userMessage = { role: 'user', content: messageText };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setCurrentMessage('');

    // Simulate AI response (you can integrate with real AI API later)
    const aiResponses = [
      "That's a great question! I can help you with your studies.",
      "Let me assist you with that topic. What specific area would you like to focus on?",
      "I understand you're looking for help. Here are some suggestions for your learning path.",
      "That's an interesting point. Let me break it down for you step by step.",
      "I'm here to support your learning journey. What course material can I help explain?"
    ];
    
    const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
    const aiMessage = { role: 'assistant', content: randomResponse };
    
    setTimeout(() => {
      setMessages([...newMessages, aiMessage]);
      speakText(randomResponse);
    }, 1000);
  };

  const saveApiKey = () => {
    localStorage.setItem('elevenlabs_api_key', elevenlabsApiKey);
    setShowApiKeyInput(false);
  };

  const getCurrentDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date().toLocaleDateString('en-US', options);
  };

  const allCourses = [
    { 
      id: 1, 
      name: "HTML & CSS Fundamentals", 
      description: "Learn the building blocks of web development from scratch",
      duration: "4 weeks",
      level: "Beginner",
      icon: Globe,
      colorClass: "course-web",
      lessons: 24
    },
    { 
      id: 2, 
      name: "JavaScript Essentials", 
      description: "Master JavaScript programming from zero to hero",
      duration: "6 weeks",
      level: "Beginner",
      icon: Code,
      colorClass: "course-programming",
      lessons: 36
    },
    { 
      id: 3, 
      name: "React Development", 
      description: "Build modern web applications with React",
      duration: "8 weeks",
      level: "Intermediate",
      icon: Code,
      colorClass: "course-data",
      lessons: 48
    },
    { 
      id: 4, 
      name: "UI/UX Design Basics", 
      description: "Design beautiful and user-friendly interfaces",
      duration: "5 weeks",
      level: "Beginner",
      icon: Palette,
      colorClass: "course-design",
      lessons: 30
    },
    { 
      id: 5, 
      name: "Python Programming", 
      description: "Learn Python from basics to advanced concepts",
      duration: "10 weeks",
      level: "Beginner",
      icon: Code,
      colorClass: "course-programming",
      lessons: 60
    },
    { 
      id: 6, 
      name: "Database Management", 
      description: "Master SQL and database design principles",
      duration: "6 weeks",
      level: "Intermediate",
      icon: Database,
      colorClass: "course-data",
      lessons: 42
    },
    { 
      id: 7, 
      name: "Mobile App Development", 
      description: "Create mobile apps for iOS and Android",
      duration: "12 weeks",
      level: "Advanced",
      icon: Smartphone,
      colorClass: "course-mobile",
      lessons: 72
    },
    { 
      id: 8, 
      name: "Machine Learning Basics", 
      description: "Introduction to AI and machine learning concepts",
      duration: "8 weeks",
      level: "Intermediate",
      icon: Brain,
      colorClass: "course-ai",
      lessons: 48
    },
    { 
      id: 9, 
      name: "Data Science Fundamentals", 
      description: "Learn data analysis and visualization techniques",
      duration: "9 weeks",
      level: "Intermediate",
      icon: TrendingUp,
      colorClass: "course-data",
      lessons: 54
    },
    { 
      id: 10, 
      name: "Cybersecurity Fundamentals", 
      description: "Learn to protect systems and networks from threats",
      duration: "7 weeks",
      level: "Intermediate",
      icon: Shield,
      colorClass: "course-security",
      lessons: 35
    },
    { 
      id: 11, 
      name: "Digital Marketing", 
      description: "Master online marketing strategies and techniques",
      duration: "6 weeks",
      level: "Beginner",
      icon: TrendingUp,
      colorClass: "course-marketing",
      lessons: 30
    },
    { 
      id: 12, 
      name: "Cloud Computing", 
      description: "Learn AWS, Azure, and Google Cloud platforms",
      duration: "9 weeks",
      level: "Intermediate",
      icon: Globe,
      colorClass: "course-cloud",
      lessons: 45
    },
    { 
      id: 13, 
      name: "Artificial Intelligence", 
      description: "Explore AI algorithms and neural networks",
      duration: "10 weeks",
      level: "Advanced",
      icon: Brain,
      colorClass: "course-ai",
      lessons: 50
    },
    { 
      id: 14, 
      name: "Blockchain Technology", 
      description: "Understand cryptocurrencies and smart contracts",
      duration: "8 weeks",
      level: "Advanced",
      icon: Coins,
      colorClass: "course-blockchain",
      lessons: 40
    },
    { 
      id: 15, 
      name: "Game Development", 
      description: "Create games using Unity and Unreal Engine",
      duration: "12 weeks",
      level: "Intermediate",
      icon: Gamepad2,
      colorClass: "course-game",
      lessons: 60
    }
  ];

  const classLevels = [
    { id: 'class11', name: 'Class 11', subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English'] },
    { id: 'class12', name: 'Class 12', subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English'] },
    { id: 'btech', name: 'B.Tech', subjects: ['Computer Science', 'Mechanical', 'Electrical', 'Civil', 'Electronics'] },
    { id: 'mtech', name: 'M.Tech', subjects: ['AI/ML', 'Data Science', 'Cybersecurity', 'Software Engineering'] },
    { id: 'diploma', name: 'Diploma', subjects: ['Mechanical', 'Electrical', 'Civil', 'Computer Science'] },
    { id: 'competitive', name: 'Competitive Exams', subjects: ['JEE', 'NEET', 'GATE', 'CAT', 'GRE'] }
  ];

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const enrollInCourse = (courseId) => {
    const course = allCourses.find(c => c.id === courseId);
    if (course && !enrolledCourses.find(c => c.id === courseId)) {
      setEnrolledCourses([...enrolledCourses, { ...course, progress: 0, enrolled: true }]);
      // Award 1 kudo for enrollment
      setKudosCount(prev => prev + 1);
    }
  };

  const completeTask = () => {
    setKudosCount(prev => prev + 1);
  };

  const handleLogout = () => {
    console.log("User logged out");
    setSettingsOpen(false);
  };

  const menuItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'career', icon: Target, label: 'Career Guidance' },
    { id: 'classes', icon: GraduationCap, label: 'Classes' },
    { id: 'available-courses', icon: BookOpen, label: 'Available Courses' },
    { id: 'courses', icon: BookOpen, label: 'My Courses' },
    { id: 'schedule', icon: Calendar, label: 'Schedule' },
    { id: 'assignments', icon: FileText, label: 'Assignments' },
    { id: 'community', icon: Users, label: 'Community' },
    { id: 'certificates', icon: Award, label: 'Certificates' },
    { id: 'resources', icon: Youtube, label: 'Resources' }
  ];

  return (
    <div className={`min-h-screen bg-sky-50 dark:bg-background transition-colors duration-300`}>
      {/* Header */}
      <header className="bg-surface border-b border-border shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                EduAI
              </h1>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search courses, assignments..."
                className="pl-10 pr-4 py-2 w-80 border border-input bg-surface text-foreground placeholder:text-muted-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors">
              <Award className="w-5 h-5 text-warning" />
              {kudosCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-warning text-warning-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {kudosCount}
                </span>
              )}
            </button>
            <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="flex items-center space-x-2 p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors">
              <User className="w-5 h-5" />
              <span className="font-medium">Student</span>
            </button>
            <div className="relative">
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center space-x-1 p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5" />
                <ChevronDown className="w-3 h-3" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-xl z-50">
                  <div className="p-2">
                    <button 
                      onClick={() => { setActiveTab('career'); setMenuOpen(false); }}
                      className="w-full flex items-center space-x-2 p-2 text-foreground hover:bg-accent rounded-md transition-colors"
                    >
                      <Target className="w-4 h-4" />
                      <span>Career Guidance</span>
                    </button>
                    <button 
                      onClick={() => { setActiveTab('classes'); setMenuOpen(false); }}
                      className="w-full flex items-center space-x-2 p-2 text-foreground hover:bg-accent rounded-md transition-colors"
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>Classes</span>
                    </button>
                    <button 
                      onClick={() => { setActiveTab('available-courses'); setMenuOpen(false); }}
                      className="w-full flex items-center space-x-2 p-2 text-foreground hover:bg-accent rounded-md transition-colors"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Available Courses</span>
                    </button>
                    <button 
                      onClick={() => { setActiveTab('courses'); setMenuOpen(false); }}
                      className="w-full flex items-center space-x-2 p-2 text-foreground hover:bg-accent rounded-md transition-colors"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>My Courses</span>
                    </button>
                    <button 
                      onClick={() => { setActiveTab('schedule'); setMenuOpen(false); }}
                      className="w-full flex items-center space-x-2 p-2 text-foreground hover:bg-accent rounded-md transition-colors"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Schedule</span>
                    </button>
                    <button 
                      onClick={() => { setActiveTab('assignments'); setMenuOpen(false); }}
                      className="w-full flex items-center space-x-2 p-2 text-foreground hover:bg-accent rounded-md transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Assignments</span>
                    </button>
                    <button 
                      onClick={() => { setActiveTab('community'); setMenuOpen(false); }}
                      className="w-full flex items-center space-x-2 p-2 text-foreground hover:bg-accent rounded-md transition-colors"
                    >
                      <Users className="w-4 h-4" />
                      <span>Community</span>
                    </button>
                    <button 
                      onClick={() => { setActiveTab('certificates'); setMenuOpen(false); }}
                      className="w-full flex items-center space-x-2 p-2 text-foreground hover:bg-accent rounded-md transition-colors"
                    >
                      <Award className="w-4 h-4" />
                      <span>Certificates</span>
                    </button>
                    <button 
                      onClick={() => { setActiveTab('resources'); setMenuOpen(false); }}
                      className="w-full flex items-center space-x-2 p-2 text-foreground hover:bg-accent rounded-md transition-colors"
                    >
                      <Youtube className="w-4 h-4" />
                      <span>Resources</span>
                    </button>
                    <hr className="my-2 border-border" />
                    <button 
                      onClick={() => { setSettingsOpen(!settingsOpen); setMenuOpen(false); }}
                      className="w-full flex items-center space-x-2 p-2 text-foreground hover:bg-accent rounded-md transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                  </div>
                  {settingsOpen && (
                    <div className="border-t border-border p-2">
                      <button 
                        onClick={toggleDarkMode}
                        className="w-full flex items-center space-x-2 p-2 text-foreground hover:bg-accent rounded-md transition-colors"
                      >
                        {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 p-2 text-danger hover:bg-accent rounded-md transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Icon Sidebar */}
        <aside 
          className="w-20 bg-surface shadow-sm h-screen sticky top-0 transition-all duration-300 border-r border-border"
        >
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-center px-3 py-3 rounded-lg text-left transition-all duration-200 group relative ${
                    activeTab === item.id 
                    ? 'bg-gradient-primary text-white shadow-primary' 
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <div className="absolute left-full ml-2 px-2 py-1 bg-foreground text-background text-sm rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
                    {item.label}
                  </div>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'home' && (
            <div className="space-y-6">
              {/* Welcome Section */}
              <div className="bg-gradient-hero rounded-xl p-6 text-white shadow-primary hover-lift">
                <h2 className="text-2xl font-bold mb-2">Welcome back, Student! 👋</h2>
                <p className="text-white/80">{getCurrentDate()}</p>
                <p className="text-white/80 mt-1">Start your learning journey with EduAI today.</p>
              </div>

              {/* Career Guidance Section */}
              <div className="bg-surface p-6 rounded-xl shadow-sm border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-primary" />
                  AI Career Guidance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-surface-variant p-4 rounded-lg border border-border hover:shadow-md transition-all hover-scale cursor-pointer">
                    <div className="flex items-center mb-3">
                      <Brain className="w-6 h-6 text-primary mr-2" />
                      <h4 className="font-semibold text-foreground">Personalized Career Test</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Discover your ideal career path through AI-powered assessments
                    </p>
                    <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-dark transition-colors">
                      Take Test
                    </button>
                  </div>
                  <div className="bg-surface-variant p-4 rounded-lg border border-border hover:shadow-md transition-all hover-scale cursor-pointer">
                    <div className="flex items-center mb-3">
                      <School className="w-6 h-6 text-success mr-2" />
                      <h4 className="font-semibold text-foreground">College Finder</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Find the best schools and colleges in India for your career goals
                    </p>
                    <button className="w-full px-4 py-2 bg-success text-success-foreground rounded-lg hover:opacity-90 transition-colors">
                      Explore Colleges
                    </button>
                  </div>
                  <div className="bg-surface-variant p-4 rounded-lg border border-border hover:shadow-md transition-all hover-scale cursor-pointer">
                    <div className="flex items-center mb-3">
                      <Map className="w-6 h-6 text-info mr-2" />
                      <h4 className="font-semibold text-foreground">Course Roadmap</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Get personalized learning paths based on your test results
                    </p>
                    <button className="w-full px-4 py-2 bg-info text-info-foreground rounded-lg hover:opacity-90 transition-colors">
                      View Roadmap
                    </button>
                  </div>
                </div>
              </div>

              {/* Available Courses - Show only 3 initially */}
              <div className="bg-surface p-6 rounded-xl shadow-sm border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Available Courses</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {allCourses.slice(0, 3).map((course) => {
                    const Icon = course.icon;
                    return (
                      <div key={course.id} className="bg-surface-variant p-4 rounded-lg border border-border hover:shadow-md transition-all hover-scale">
                        <div className="flex items-start justify-between mb-3">
                          <div className={`p-2 ${course.colorClass} rounded-lg`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">
                            {course.level}
                          </span>
                        </div>
                        <h4 className="font-semibold text-foreground mb-2">{course.name}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{course.description}</p>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs text-muted-foreground">{course.duration}</span>
                          <span className="text-xs text-muted-foreground">{course.lessons} lessons</span>
                        </div>
                        <button 
                          onClick={() => enrollInCourse(course.id)}
                          className={`w-full px-4 py-2 ${course.colorClass} text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
                          disabled={enrolledCourses.find(c => c.id === course.id)}
                        >
                          {enrolledCourses.find(c => c.id === course.id) ? 'Enrolled' : 'Enroll Now'}
                        </button>
                      </div>
                    );
                  })}
                </div>
                <button 
                  onClick={() => setShowAllCourses(!showAllCourses)}
                  className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
                >
                  <span>More Courses</span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${showAllCourses ? 'rotate-90' : ''}`} />
                </button>
                
                {showAllCourses && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {allCourses.slice(3).map((course) => {
                      const Icon = course.icon;
                      return (
                        <div key={course.id} className="bg-surface-variant p-4 rounded-lg border border-border hover:shadow-md transition-all hover-scale">
                          <div className="flex items-start justify-between mb-3">
                            <div className={`p-2 ${course.colorClass} rounded-lg`}>
                              <Icon className="w-6 h-6" />
                            </div>
                            <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">
                              {course.level}
                            </span>
                          </div>
                          <h4 className="font-semibold text-foreground mb-2">{course.name}</h4>
                          <p className="text-sm text-muted-foreground mb-3">{course.description}</p>
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-xs text-muted-foreground">{course.duration}</span>
                            <span className="text-xs text-muted-foreground">{course.lessons} lessons</span>
                          </div>
                          <button 
                            onClick={() => enrollInCourse(course.id)}
                            className={`w-full px-4 py-2 ${course.colorClass} text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
                            disabled={enrolledCourses.find(c => c.id === course.id)}
                          >
                            {enrolledCourses.find(c => c.id === course.id) ? 'Enrolled' : 'Enroll Now'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Recent Activity & Upcoming */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-surface p-6 rounded-xl shadow-sm border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
                  {enrolledCourses.length > 0 ? (
                    <div className="space-y-3">
                      {enrolledCourses.slice(0, 3).map((course) => (
                        <div key={course.id} className="flex items-center space-x-3">
                          <div className={`p-2 ${course.colorClass} rounded-lg`}>
                            <course.icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Enrolled in {course.name}</p>
                            <p className="text-sm text-muted-foreground">Just now</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No recent activity yet</p>
                      <p className="text-sm text-muted-foreground mt-2">Your activity will appear here</p>
                    </div>
                  )}
                </div>

                <div className="bg-surface p-6 rounded-xl shadow-sm border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Upcoming Classes</h3>
                  {enrolledCourses.length > 0 ? (
                    <div className="space-y-3">
                      {enrolledCourses.slice(0, 3).map((course) => (
                        <div key={course.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 ${course.colorClass} rounded-lg`}>
                              <course.icon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{course.name}</p>
                              <p className="text-sm text-muted-foreground">Lesson 1 - Getting Started</p>
                            </div>
                          </div>
                          <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">
                            Available now
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No upcoming classes</p>
                      <p className="text-sm text-muted-foreground mt-2">Enroll in courses to see your schedule</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'classes' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Classes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classLevels.map((level) => (
                  <div key={level.id} className="bg-surface p-6 rounded-xl shadow-sm border border-border hover:shadow-lg transition-all hover-scale">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-gradient-primary rounded-lg">
                        <GraduationCap className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">
                        {level.subjects.length} subjects
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{level.name}</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {level.subjects.map((subject, index) => (
                        <span key={index} className="text-xs px-2 py-1 bg-accent text-accent-foreground rounded-full">
                          {subject}
                        </span>
                      ))}
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedClass(level.id);
                        completeTask();
                      }}
                      className={`w-full px-4 py-2 rounded-lg transition-all transform hover:scale-105 ${
                        selectedClass === level.id 
                          ? 'bg-success text-success-foreground' 
                          : 'bg-gradient-primary text-white hover:shadow-lg'
                      }`}
                    >
                      {selectedClass === level.id ? 'Selected' : 'Select Class'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">My Courses</h2>
              {enrolledCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrolledCourses.map((course) => {
                    const Icon = course.icon;
                    return (
                      <div key={course.id} className="bg-surface p-6 rounded-xl shadow-sm border border-border hover:shadow-lg transition-all hover-lift">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-3 ${course.colorClass} rounded-lg`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">
                            {course.level}
                          </span>
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">{course.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-muted-foreground">Progress</span>
                            <span className="text-sm font-medium text-foreground">{course.progress}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className={`${course.colorClass} h-2 rounded-full transition-all`}
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <button className={`w-full px-4 py-2 ${course.colorClass} text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2`}>
                          <Play className="w-4 h-4" />
                          <span>Continue Learning</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Courses Yet</h3>
                  <p className="text-muted-foreground mb-4">Start your learning journey by enrolling in courses</p>
                  <button 
                    onClick={() => setActiveTab('home')}
                    className="px-6 py-2 bg-gradient-primary text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105"
                  >
                    Browse Courses
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'assignments' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Assignments</h2>
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No Assignments Yet</h3>
                <p className="text-muted-foreground">Your assignments will appear here once you enroll in courses</p>
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Learning Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-surface p-6 rounded-xl shadow-sm border border-border hover:shadow-lg transition-all hover-lift">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
                      <Youtube className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">YouTube Tutorials</h3>
                  <p className="text-sm text-muted-foreground mb-4">Curated video content for enhanced learning</p>
                  <button className="w-full px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105">
                    Coming Soon
                  </button>
                </div>
                <div className="bg-surface p-6 rounded-xl shadow-sm border border-border hover:shadow-lg transition-all hover-lift">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">External Links</h3>
                  <p className="text-sm text-muted-foreground mb-4">Useful educational websites and resources</p>
                  <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105">
                    Coming Soon
                  </button>
                </div>
                <div className="bg-surface p-6 rounded-xl shadow-sm border border-border hover:shadow-lg transition-all hover-lift">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Study Materials</h3>
                  <p className="text-sm text-muted-foreground mb-4">Downloadable PDFs and study guides</p>
                  <button className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105">
                    Coming Soon
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'available-courses' && (
            <div className="space-y-6">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>All Available Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allCourses.map((course) => {
                  const Icon = course.icon;
                  return (
                     <div key={course.id} className="bg-surface p-6 rounded-xl shadow-sm border border-border hover:shadow-lg transition-all hover-lift">
                       <div className="flex items-start justify-between mb-4">
                         <div className={`p-3 ${course.colorClass} rounded-lg`}>
                           <Icon className="w-6 h-6" />
                         </div>
                         <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">
                           {course.level}
                         </span>
                       </div>
                       <h3 className="font-semibold text-foreground mb-2">{course.name}</h3>
                       <p className="text-sm text-muted-foreground mb-3">{course.description}</p>
                       <div className="flex justify-between items-center mb-4">
                         <span className="text-xs text-muted-foreground">{course.duration}</span>
                         <span className="text-xs text-muted-foreground">{course.lessons} lessons</span>
                       </div>
                       <button 
                         onClick={() => enrollInCourse(course.id)}
                         className={`w-full px-4 py-2 ${course.colorClass} text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
                         disabled={enrolledCourses.find(c => c.id === course.id)}
                       >
                         {enrolledCourses.find(c => c.id === course.id) ? 'Enrolled' : 'Enroll Now'}
                       </button>
                     </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'community' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Community</h2>
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Join Our Learning Community</h3>
                <p className="text-muted-foreground mb-4">Connect with fellow students and share your learning journey</p>
                <button className="px-6 py-2 bg-gradient-primary text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105">
                  Join Community
                </button>
              </div>
            </div>
          )}

          {activeTab === 'certificates' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Certificates</h2>
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-warning" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No Certificates Yet</h3>
                <p className="text-muted-foreground">Complete courses to earn certificates and showcase your achievements</p>
              </div>
            </div>
          )}

          {activeTab === 'career' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Career Guidance</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { id: 1, name: "Career Quiz", description: "Discover your ideal career path", icon: HelpCircle, colorClass: "course-data" },
                  { id: 2, name: "Roadmap", description: "Get personalized learning roadmaps", icon: Map, colorClass: "course-programming" },
                  { id: 3, name: "College Suggestions", description: "Find the best colleges for your goals", icon: School, colorClass: "course-design" }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.id} className="bg-surface p-6 rounded-xl shadow-sm border border-border hover:shadow-lg transition-all hover-lift">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 ${item.colorClass} rounded-lg`}>
                          <Icon className="w-6 h-6" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                      <button className={`w-full px-4 py-2 ${item.colorClass} text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105`}>
                        Get Started
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'tests' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Tests & Quizzes</h2>
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ClipboardCheck className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No Tests Available</h3>
                <p className="text-muted-foreground">Tests will appear here as you progress through your courses</p>
              </div>
            </div>
          )}


          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Schedule</h2>
              {enrolledCourses.length > 0 ? (
                <div className="space-y-4">
                  <div className="bg-surface p-6 rounded-xl shadow-sm border border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Today's Schedule</h3>
                    <div className="space-y-3">
                      {enrolledCourses.map((course, index) => (
                        <div key={course.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 ${course.colorClass} rounded-lg`}>
                              <course.icon className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{course.name}</p>
                              <p className="text-sm text-muted-foreground">Lesson {index + 1}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-foreground">
                              {9 + index}:00 AM
                            </p>
                            <p className="text-xs text-muted-foreground">45 min</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Kudos Section */}
                  <div className="bg-surface p-6 rounded-xl shadow-sm border border-border">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-warning rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trophy className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Kudos!</h3>
                      <p className="text-muted-foreground mb-4">
                        Great job on enrolling in {enrolledCourses.length} course{enrolledCourses.length !== 1 ? 's' : ''}! 
                        Keep up the excellent work on your learning journey.
                      </p>
                      <div className="flex items-center justify-center space-x-2">
                        <Heart className="w-5 h-5 text-red-500 fill-current" />
                        <span className="text-sm text-foreground">
                          You're doing amazing!
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-warning" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Schedule Yet</h3>
                    <p className="text-muted-foreground">Your class schedule will appear here</p>
                  </div>
                  
                  <div className="bg-surface p-6 rounded-xl shadow-sm border border-border">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Ready to Start?</h3>
                      <p className="text-muted-foreground mb-4">
                        Welcome to your learning journey! Enroll in courses to get personalized kudos and track your progress.
                      </p>
                      <button 
                        onClick={() => setActiveTab('home')}
                        className="px-6 py-2 bg-gradient-primary text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105"
                      >
                        Explore Courses
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-surface border-t border-border mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  EduAI
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering students with AI-driven personalized learning experiences.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Learning</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">All Courses</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Career Guidance</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Community</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Certificates</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 EduAI. All rights reserved. Made with ❤️ for students worldwide.
            </p>
          </div>
        </div>
      </footer>

      {/* AI Chatbot with Voice Assistant */}
      {chatVisible && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-surface rounded-xl shadow-2xl border border-border w-96 h-96 flex flex-col">
            <div className="flex items-center justify-between p-4 bg-gradient-primary text-white rounded-t-xl">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <span className="font-medium">EduAI Voice Assistant</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                  className="text-white/80 hover:text-white transition-colors p-1"
                  title="Configure ElevenLabs API"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setChatVisible(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {showApiKeyInput && (
              <div className="p-4 bg-surface-variant border-b border-border">
                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">ElevenLabs API Key (optional)</label>
                  <div className="flex space-x-2">
                    <input
                      type="password"
                      value={elevenlabsApiKey}
                      onChange={(e) => setElevenlabsApiKey(e.target.value)}
                      placeholder="Enter your ElevenLabs API key"
                      className="flex-1 px-2 py-1 text-xs border border-input bg-surface text-foreground rounded"
                    />
                    <button
                      onClick={saveApiKey}
                      className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded hover:bg-primary-dark"
                    >
                      Save
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Add your ElevenLabs API key for premium voice quality. Browser TTS will be used as fallback.
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex-1 p-4 bg-surface-variant overflow-y-auto">
              <div className="space-y-3">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-surface shadow-sm border border-border'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isSpeaking && (
                  <div className="flex justify-start">
                    <div className="bg-surface p-3 rounded-lg shadow-sm border border-border">
                      <div className="flex items-center space-x-2">
                        <Volume2 className="w-4 h-4 text-primary animate-pulse" />
                        <span className="text-sm text-muted-foreground">Speaking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 border-t border-border">
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything or use voice..."
                  className="flex-1 px-3 py-2 border border-input bg-surface text-foreground placeholder:text-muted-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                <button 
                  onClick={isListening ? stopListening : startListening}
                  className={`p-2 rounded-lg transition-all ${
                    isListening 
                      ? 'bg-danger text-danger-foreground animate-pulse' 
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary-dark'
                  }`}
                  title={isListening ? 'Stop listening' : 'Start voice input'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <button 
                  onClick={isSpeaking ? stopSpeaking : () => handleSendMessage()}
                  className={`p-2 rounded-lg transition-all ${
                    isSpeaking 
                      ? 'bg-warning text-warning-foreground' 
                      : 'bg-primary text-primary-foreground hover:bg-primary-dark'
                  }`}
                  title={isSpeaking ? 'Stop speaking' : 'Send message'}
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
              {isListening && (
                <div className="mt-2 text-center">
                  <span className="text-xs text-muted-foreground animate-pulse">🎤 Listening...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating AI Voice Assistant Button */}
      <button
        onClick={() => setChatVisible(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-primary text-white rounded-full shadow-glow hover:shadow-xl transition-all duration-300 flex items-center justify-center group z-40 hover:scale-110 animate-float"
        title="Open Voice Assistant"
      >
        <div className="relative">
          <Bot className="w-6 h-6" />
          {(isListening || isSpeaking) && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse"></div>
          )}
        </div>
      </button>

      {/* Click outside to close menu */}
      {menuOpen && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
    </div>
  );
}
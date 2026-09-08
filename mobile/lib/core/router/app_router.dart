import 'package:go_router/go_router.dart';
import '../../features/auth/presentation/login_screen.dart';
import '../../features/dashboard/presentation/dashboard_screen.dart';
import '../../features/tickets/presentation/ticket_qr_screen.dart';
import '../../features/scanner/presentation/volunteer_scanner_screen.dart';

final GoRouter appRouter = GoRouter(
  initialLocation: '/login',
  routes: [
    GoRoute(
      path: '/login',
      builder: (context, state) => const LoginScreen(),
    ),
    GoRoute(
      path: '/dashboard',
      builder: (context, state) => const DashboardScreen(),
    ),
    GoRoute(
      path: '/ticket',
      builder: (context, state) => const TicketQrScreen(),
    ),
    GoRoute(
      path: '/scanner',
      builder: (context, state) => const VolunteerScannerScreen(),
    ),
  ],
);

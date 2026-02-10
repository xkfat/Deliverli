import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../core/constants/app_colors.dart';
import '../../../logic/cubit/commande/profile_cubit.dart';

class ChangePasswordScreen extends StatefulWidget {
  const ChangePasswordScreen({Key? key}) : super(key: key);

  @override
  State<ChangePasswordScreen> createState() => _ChangePasswordScreenState();
}

class _ChangePasswordScreenState extends State<ChangePasswordScreen> {
  final _formKey = GlobalKey<FormState>();
  final _oldPasswordController = TextEditingController();
  final _newPasswordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  
  bool _obscureOldPassword = true;
  bool _obscureNewPassword = true;
  bool _obscureConfirmPassword = true;

  @override
  void dispose() {
    _oldPasswordController.dispose();
    _newPasswordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.lightBackground,
      appBar: AppBar(
        title: const Text('Changer le mot de passe'),
        backgroundColor: AppColors.primaryBlue,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: BlocConsumer<ProfileCubit, ProfileState>(
        listener: (context, state) {
          if (state is ProfileSuccess) {
            _showFeedbackDialog(
              context: context,
              isError: false,
              message: state.message,
              onPressed: () {
                Navigator.of(context).pop(); // Close dialog
                Navigator.of(context).pop(); // Close screen
              },
            );
          } else if (state is ProfileError) {
            _showFeedbackDialog(
              context: context,
              isError: true,
              message: state.message,
            );
          }
        },
        builder: (context, state) {
          final isLoading = state is ProfileLoading;

          return Column(
            children: [
              // 1. Premium Header with Info
              _buildHeaderSection(),

              // 2. Form Content
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(24),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildPasswordField(
                          label: 'Ancien mot de passe',
                          hint: '••••••••',
                          controller: _oldPasswordController,
                          obscure: _obscureOldPassword,
                          isLoading: isLoading,
                          toggleObscure: () => setState(() => _obscureOldPassword = !_obscureOldPassword),
                        ),
                        const SizedBox(height: 20),
                        _buildPasswordField(
                          label: 'Nouveau mot de passe',
                          hint: 'Minimum 8 caractères',
                          controller: _newPasswordController,
                          obscure: _obscureNewPassword,
                          isLoading: isLoading,
                          toggleObscure: () => setState(() => _obscureNewPassword = !_obscureNewPassword),
                        ),
                        const SizedBox(height: 20),
                        _buildPasswordField(
                          label: 'Confirmer le mot de passe',
                          hint: 'Répétez le nouveau mot de passe',
                          controller: _confirmPasswordController,
                          obscure: _obscureConfirmPassword,
                          isLoading: isLoading,
                          toggleObscure: () => setState(() => _obscureConfirmPassword = !_obscureConfirmPassword),
                        ),
                        const SizedBox(height: 40),
                        
                        // Submit Button
                        _buildSubmitButton(isLoading),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildHeaderSection() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
      decoration: const BoxDecoration(
        color: AppColors.primaryBlue,
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(30),
          bottomRight: Radius.circular(30),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
        
          const SizedBox(height: 8),
          Text(
            'Assurez-vous d\'utiliser un mot de passe sécurisé pour protéger votre compte livreur.',
            style: TextStyle(
              color: Colors.white.withOpacity(0.8),
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPasswordField({
    required String label,
    required String hint,
    required TextEditingController controller,
    required bool obscure,
    required bool isLoading,
    required VoidCallback toggleObscure,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.bold,
            color: AppColors.textDark,
          ),
        ),
        const SizedBox(height: 8),
        TextFormField(
          controller: controller,
          obscureText: obscure,
          enabled: !isLoading,
          style: const TextStyle(fontSize: 15),
          decoration: InputDecoration(
            filled: true,
            fillColor: Colors.white,
            hintText: hint,
            hintStyle: TextStyle(color: AppColors.textGrey.withOpacity(0.5)),
            prefixIcon: const Icon(Icons.lock_outline, color: AppColors.primaryBlue),
            suffixIcon: IconButton(
              icon: Icon(
                obscure ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                color: AppColors.textGrey,
                size: 20,
              ),
              onPressed: toggleObscure,
            ),
            contentPadding: const EdgeInsets.symmetric(vertical: 16, horizontal: 16),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide.none,
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: Colors.grey.shade200),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: AppColors.primaryBlue, width: 1.5),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: AppColors.error),
            ),
          ),
          validator: (value) => (value == null || value.isEmpty) ? 'Champ requis' : null,
        ),
      ],
    );
  }

  Widget _buildSubmitButton(bool isLoading) {
    return SizedBox(
      width: double.infinity,
      height: 56,
      child: ElevatedButton(
        onPressed: isLoading ? null : _handleSubmit,
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primaryBlue,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
          elevation: 2,
        ),
        child: isLoading
            ? const SizedBox(
                width: 24,
                height: 24,
                child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
              )
            : const Text(
                'Confirmer les modifications',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
      ),
    );
  }

  void _handleSubmit() {
    if (!_formKey.currentState!.validate()) return;

    if (_newPasswordController.text != _confirmPasswordController.text) {
      _showFeedbackDialog(context: context, isError: true, message: 'Les mots de passe ne correspondent pas');
      return;
    }

    FocusScope.of(context).unfocus();
    context.read<ProfileCubit>().changePassword(
      oldPassword: _oldPasswordController.text,
      newPassword: _newPasswordController.text,
    );
  }

  void _showFeedbackDialog({
    required BuildContext context,
    required bool isError,
    required String message,
    VoidCallback? onPressed,
  }) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(height: 10),
            Icon(
              isError ? Icons.error_outline : Icons.check_circle_outline,
              color: isError ? AppColors.error : AppColors.success,
              size: 60,
            ),
            const SizedBox(height: 20),
            Text(
              isError ? 'Oups !' : 'Parfait !',
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            Text(message, textAlign: TextAlign.center, style: const TextStyle(color: AppColors.textGrey)),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: onPressed ?? () => Navigator.pop(ctx),
                style: ElevatedButton.styleFrom(
                  backgroundColor: isError ? AppColors.error : AppColors.success,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text('OK', style: TextStyle(color: Colors.white)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
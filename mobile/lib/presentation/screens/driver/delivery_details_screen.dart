import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import '../../../core/constants/app_colors.dart';
import '../../../data/models/commande_model.dart';
import '../../../logic/cubit/commande/commande_cubit.dart';
import '../../widgets/custom_marker_helper.dart';

class DeliveryDetailScreen extends StatefulWidget {
  final CommandeModel commande;

  const DeliveryDetailScreen({
    Key? key,
    required this.commande,
  }) : super(key: key);

  @override
  State<DeliveryDetailScreen> createState() => _DeliveryDetailScreenState();
}

class _DeliveryDetailScreenState extends State<DeliveryDetailScreen> {
  GoogleMapController? _mapController;
  BitmapDescriptor? _truckMarker;

  // Mock locations - will come from API or commande model
  late LatLng _pickupLocation;
  late LatLng _deliveryLocation;

  // Mock estimated time and distance - will come from API
  final String _estimatedDuration = '15 min';
  final String _estimatedDistance = '3.2 km';

  @override
  void initState() {
    super.initState();
    _loadCustomMarkers();
    
    // Use coordinates from commande if available, otherwise use defaults
    _deliveryLocation = LatLng(
      widget.commande.latitude ?? 34.025,
      widget.commande.longitude ?? -6.835,
    );
    _pickupLocation = const LatLng(34.020882, -6.841650); // Default pickup
  }

  Future<void> _loadCustomMarkers() async {
    _truckMarker = await CustomMarkerHelper.createTruckMarker(size: 80);
    if (mounted) setState(() {});
  }

  Set<Marker> _createMarkers() {
    return {
      Marker(
        markerId: const MarkerId('pickup'),
        position: _pickupLocation,
        icon: _truckMarker ?? BitmapDescriptor.defaultMarkerWithHue(BitmapDescriptor.hueOrange),
        anchor: const Offset(0.5, 0.5),
      ),
      Marker(
        markerId: const MarkerId('delivery'),
        position: _deliveryLocation,
      ),
    };
  }

  Set<Polyline> _createRoute() {
    return {
      Polyline(
        polylineId: const PolylineId('route'),
        points: [_pickupLocation, _deliveryLocation],
        color: AppColors.primaryBlue,
        width: 4,
        patterns: [PatternItem.dash(20), PatternItem.gap(10)],
      ),
    };
  }

  /// Open Google Maps for navigation
  Future<void> _openInGoogleMaps() async {
    final String googleMapsUrl = 
        'https://www.google.com/maps/dir/?api=1'
        '&origin=${_pickupLocation.latitude},${_pickupLocation.longitude}'
        '&destination=${_deliveryLocation.latitude},${_deliveryLocation.longitude}'
        '&travelmode=driving';

    final Uri uri = Uri.parse(googleMapsUrl);

    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text('Impossible d\'ouvrir Google Maps'),
            backgroundColor: AppColors.error,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            margin: const EdgeInsets.all(16),
          ),
        );
      }
    }
  }

  /// Open destination only in Google Maps
  Future<void> _navigateToDestination() async {
    final String googleMapsUrl = 
        'https://www.google.com/maps/dir/?api=1'
        '&destination=${_deliveryLocation.latitude},${_deliveryLocation.longitude}'
        '&travelmode=driving';

    final Uri uri = Uri.parse(googleMapsUrl);

    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text('Impossible d\'ouvrir Google Maps'),
            backgroundColor: AppColors.error,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            margin: const EdgeInsets.all(16),
          ),
        );
      }
    }
  }

  String _getNextStatusText() {
    if (widget.commande.isEnAttente) {
      return 'Commencer la livraison';
    } else if (widget.commande.isEnCours) {
      return 'Marquer comme livré';
    }
    return '';
  }

  void _updateStatus() {
    if (widget.commande.isEnAttente) {
      context.read<CommandeCubit>().updateStatus(widget.commande.id, 'En cours');
      Navigator.pop(context);
    } else if (widget.commande.isEnCours) {
      _showDeliveryConfirmation();
    }
  }

  void _showDeliveryConfirmation() {
    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Confirmer la livraison'),
        content: Text(
          'Confirmer que le colis a été livré à ${widget.commande.clientName} ?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext),
            child: const Text('Annuler'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(dialogContext);
              context.read<CommandeCubit>().updateStatus(widget.commande.id, 'Livré');
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Livraison confirmée'),
                  backgroundColor: AppColors.success,
                ),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.success,
            ),
            child: const Text('Confirmer'),
          ),
        ],
      ),
    );
  }

  Future<void> _callClient() async {
    final String phoneNumber = widget.commande.clientPhone;
    final Uri phoneUri = Uri(scheme: 'tel', path: phoneNumber);

    if (await canLaunchUrl(phoneUri)) {
      await launchUrl(phoneUri);
    } else {
      if (mounted) {
        _showPhoneBottomSheet(phoneNumber);
      }
    }
  }

  void _showPhoneBottomSheet(String phoneNumber) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        padding: const EdgeInsets.all(24),
        decoration: const BoxDecoration(
          color: AppColors.cardBackground,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 40,
              height: 4,
              margin: const EdgeInsets.only(bottom: 20),
              decoration: BoxDecoration(
                color: AppColors.divider,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            CircleAvatar(
              radius: 36,
              backgroundColor: AppColors.primaryBlue.withOpacity(0.1),
              child: const Icon(Icons.person, size: 36, color: AppColors.primaryBlue),
            ),
            const SizedBox(height: 12),
            Text(
              widget.commande.clientName,
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.textDark),
            ),
            const Text(
              'Client',
              style: TextStyle(color: AppColors.textGrey, fontSize: 14),
            ),
            const SizedBox(height: 24),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
              decoration: BoxDecoration(
                color: AppColors.inputBackground,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.phone, color: AppColors.primaryBlue, size: 20),
                  const SizedBox(width: 10),
                  Text(
                    phoneNumber,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                      letterSpacing: 1,
                      color: AppColors.textDark,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton.icon(
                onPressed: () async {
                  await Clipboard.setData(ClipboardData(text: phoneNumber));
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: const Row(
                        children: [
                          Icon(Icons.check_circle, color: AppColors.textLight, size: 20),
                          SizedBox(width: 10),
                          Text('Numéro copié dans le presse-papiers'),
                        ],
                      ),
                      backgroundColor: AppColors.success,
                      behavior: SnackBarBehavior.floating,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      margin: const EdgeInsets.all(16),
                    ),
                  );
                },
                icon: const Icon(Icons.copy, color: AppColors.textLight),
                label: const Text(
                  'Copier le numéro',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.textLight),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primaryBlue,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
            ),
            const SizedBox(height: 12),
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text(
                'Fermer',
                style: TextStyle(color: AppColors.textGrey, fontSize: 14),
              ),
            ),
            const SizedBox(height: 10),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final commande = widget.commande;
    final statusColor = commande.statusColor;

    return Scaffold(
      backgroundColor: AppColors.lightBackground,
      body: Column(
        children: [
          // Header
          Container(
            padding: EdgeInsets.fromLTRB(20, MediaQuery.of(context).padding.top + 10, 20, 16),
            color: AppColors.primaryBlue,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Back button and status
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    GestureDetector(
                      onTap: () => Navigator.pop(context),
                      child: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: AppColors.textLight.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(Icons.arrow_back, color: AppColors.textLight, size: 24),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: statusColor,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        commande.statut,
                        style: const TextStyle(
                          color: AppColors.textLight,
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Text(
                  'Commande ${commande.trackingId}',
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textLight,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Créé le ${commande.formattedDate}',
                  style: TextStyle(
                    fontSize: 14,
                    color: AppColors.textLight.withOpacity(0.8),
                  ),
                ),
              ],
            ),
          ),

          // Content
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Map with route info
                  if (commande.latitude != null && commande.longitude != null)
                    Container(
                      decoration: BoxDecoration(
                        color: AppColors.cardBackground,
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: const [BoxShadow(color: AppColors.shadow, blurRadius: 10, offset: Offset(0, 5))],
                      ),
                      clipBehavior: Clip.antiAlias,
                      child: Column(
                        children: [
                          // Map
                          SizedBox(
                            height: 160,
                            width: double.infinity,
                            child: GoogleMap(
                              initialCameraPosition: CameraPosition(
                                target: _deliveryLocation,
                                zoom: 13,
                              ),
                              markers: _createMarkers(),
                              polylines: _createRoute(),
                              onMapCreated: (controller) {
                                _mapController = controller;
                              },
                              zoomControlsEnabled: false,
                              mapToolbarEnabled: false,
                              scrollGesturesEnabled: false,
                              zoomGesturesEnabled: false,
                            ),
                          ),

                          // Route info and navigation button
                          Padding(
                            padding: const EdgeInsets.all(12),
                            child: Row(
                              children: [
                                // Duration
                                Expanded(
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(vertical: 10),
                                    decoration: BoxDecoration(
                                      color: AppColors.inputBackground,
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    child: Row(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: [
                                        const Icon(Icons.access_time, size: 18, color: AppColors.primaryBlue),
                                        const SizedBox(width: 6),
                                        Text(
                                          _estimatedDuration,
                                          style: const TextStyle(
                                            fontSize: 14,
                                            fontWeight: FontWeight.bold,
                                            color: AppColors.textDark,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 10),

                                // Distance
                                Expanded(
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(vertical: 10),
                                    decoration: BoxDecoration(
                                      color: AppColors.inputBackground,
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    child: Row(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: [
                                        const Icon(Icons.straighten, size: 18, color: AppColors.primaryBlue),
                                        const SizedBox(width: 6),
                                        Text(
                                          _estimatedDistance,
                                          style: const TextStyle(
                                            fontSize: 14,
                                            fontWeight: FontWeight.bold,
                                            color: AppColors.textDark,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 10),

                                // Navigate button
                                GestureDetector(
                                  onTap: _openInGoogleMaps,
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                                    decoration: BoxDecoration(
                                      color: AppColors.primaryBlue,
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    child: const Row(
                                      children: [
                                        Icon(Icons.navigation, size: 18, color: AppColors.textLight),
                                        SizedBox(width: 6),
                                        Text(
                                          'Itinéraire',
                                          style: TextStyle(
                                            fontSize: 14,
                                            fontWeight: FontWeight.bold,
                                            color: AppColors.textLight,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  const SizedBox(height: 20),

                  // Client info card
                  const Text(
                    'CLIENT',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textGrey,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.cardBackground,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Row(
                      children: [
                        CircleAvatar(
                          radius: 24,
                          backgroundColor: AppColors.primaryBlue.withOpacity(0.1),
                          child: const Icon(Icons.person, color: AppColors.primaryBlue),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                commande.clientName,
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.textDark,
                                ),
                              ),
                              Text(
                                commande.clientPhone,
                                style: const TextStyle(
                                  fontSize: 14,
                                  color: AppColors.textGrey,
                                ),
                              ),
                            ],
                          ),
                        ),
                        GestureDetector(
                          onTap: _callClient,
                          child: Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: AppColors.success,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Icon(Icons.phone, color: AppColors.textLight, size: 20),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Delivery Address card
                  const Text(
                    'ADRESSE DE LIVRAISON',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textGrey,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.cardBackground,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: AppColors.success.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Icon(Icons.location_on, color: AppColors.success, size: 20),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'Adresse de destination',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: AppColors.textGrey,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                commande.adresseText,
                                style: const TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w500,
                                  color: AppColors.textDark,
                                ),
                              ),
                            ],
                          ),
                        ),
                        if (commande.latitude != null && commande.longitude != null)
                          GestureDetector(
                            onTap: _navigateToDestination,
                            child: Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: AppColors.success,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Icon(Icons.directions, color: AppColors.textLight, size: 18),
                            ),
                          ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Package details card
                  const Text(
                    'DÉTAILS DU COLIS',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textGrey,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.cardBackground,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Column(
                      children: [
                        _buildDetailRow('ID Colis', commande.trackingId),
                        const Divider(height: 20, color: AppColors.divider),
                        _buildDetailRow('Poids', commande.poids),
                        const Divider(height: 20, color: AppColors.divider),
                        _buildDetailRow('Dimensions', commande.dimensions),
                        const Divider(height: 20, color: AppColors.divider),
                        _buildDetailRow('Fragile', commande.estFragile ? 'Oui ⚠️' : 'Non'),
                        const Divider(height: 20, color: AppColors.divider),
                        _buildDetailRow('Prix total', '${commande.montant.toStringAsFixed(2)} DH'),
                        if (commande.notes != null && commande.notes!.isNotEmpty) ...[
                          const Divider(height: 20, color: AppColors.divider),
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'Notes',
                                style: TextStyle(
                                  fontSize: 14,
                                  color: AppColors.textGrey,
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Text(
                                  commande.notes!,
                                  style: const TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w600,
                                    color: AppColors.textDark,
                                  ),
                                  textAlign: TextAlign.right,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ],
                    ),
                  ),
                  const SizedBox(height: 100),
                ],
              ),
            ),
          ),
        ],
      ),

      // Bottom button
      bottomNavigationBar: !commande.isLivre && !commande.isAnnule
          ? Container(
              padding: EdgeInsets.fromLTRB(20, 16, 20, MediaQuery.of(context).padding.bottom + 16),
              decoration: BoxDecoration(
                color: AppColors.cardBackground,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 10,
                    offset: const Offset(0, -5),
                  ),
                ],
              ),
              child: SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: _updateStatus,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: commande.isEnAttente ? AppColors.primaryBlue : AppColors.success,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        commande.isEnAttente ? Icons.play_arrow : Icons.check_circle,
                        color: AppColors.textLight,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        _getNextStatusText(),
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textLight,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            )
          : null,
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 14,
            color: AppColors.textGrey,
          ),
        ),
        Text(
          value,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: AppColors.textDark,
          ),
        ),
      ],
    );
  }
}